"""Kiểm tương tác trang chủ (tủ khoá học) trên trình duyệt thật bằng Playwright.

Chạy từ thư mục frontend sau khi build:
    npm run build:preview && npm run build
    python3 kiem-thu/kiem_trang_chu.py

Phần 1 dùng bản xem thử (dữ liệu mẫu). Phần 2 dùng bản build thật, giả API Frappe để
kiểm các trạng thái đang tải, rỗng, lỗi rồi thử lại, khách chưa đăng nhập, học viên còn hạn và hết hạn.
"""

import asyncio
import json
import shutil
import sys
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.async_api import async_playwright

GOC = Path(__file__).resolve().parents[2]
KQ = []


def ghi(ten, dat, chi_tiet=""):
    KQ.append((ten, dat))
    print(("ĐẠT  " if dat else "HỎNG ") + ten + (f"  ({chi_tiet})" if chi_tiet else ""))


class _MayChu:
    """Máy chủ tĩnh; đường không có tệp thì trả index.html như Frappe trả trang sonneto."""

    def __init__(self, thu_muc, cong):
        goc = str(thu_muc)

        class XuLy(SimpleHTTPRequestHandler):
            def __init__(self, *a, **k):
                super().__init__(*a, directory=goc, **k)

            def log_message(self, *a):
                pass

            def send_head(self):
                duong = self.path.split("?")[0]
                if not Path(goc, duong.lstrip("/")).exists():
                    self.path = "/index.html"
                return super().send_head()

        self.may = ThreadingHTTPServer(("localhost", cong), XuLy)
        threading.Thread(target=self.may.serve_forever, daemon=True).start()

    def kill(self):
        self.may.shutdown()
        self.may.server_close()


def phuc_vu(thu_muc, cong):
    return _MayChu(thu_muc, cong)


async def chan_font(trang):
    # Máy kiểm không ra được Google Fonts: trả CSS rỗng cho nhanh, font dự phòng vẫn hiện.
    await trang.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))


async def phan_xem_thu(b):
    srv = phuc_vu(GOC / "frontend" / "dist-preview", 8771)
    try:
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        loi = []
        pg.on("pageerror", lambda e: loi.append(str(e)))
        await chan_font(pg)
        await pg.goto("http://localhost:8771/")
        await pg.wait_for_selector(".folder")
        so_ngan = await pg.locator(".folder").count()
        ghi("Tủ hiện đủ ngăn từ dữ liệu khoá học", so_ngan == 6, f"{so_ngan} ngăn")

        cao = lambda i: pg.locator(".folder-content").nth(i).evaluate("e => e.getBoundingClientRect().height")
        truoc = await cao(1)
        await pg.locator(".folder .tab:not(.alt-tab)").nth(1).hover()
        await pg.wait_for_timeout(800)
        sau = await cao(1)
        cuoi = await cao(5)
        ghi("Rê chuột mở rộng ngăn, ngăn cuối thu lại", sau > 200 and truoc < 60 and cuoi < 100, f"{truoc:.0f} -> {sau:.0f}, ngăn cuối {cuoi:.0f}")

        await pg.mouse.move(5, 5)
        await pg.wait_for_timeout(700)
        await pg.locator(".folder .tab:not(.alt-tab)").nth(2).focus()
        await pg.wait_for_timeout(800)
        ghi("Focus bàn phím cũng mở ngăn", await cao(2) > 200, f"{await cao(2):.0f}px")

        await pg.keyboard.press("Enter")
        await pg.wait_for_selector(".board")
        ten = await pg.locator(".lesson-heading h1").inner_text()
        ghi("Enter trên tab mở trang giấy đúng khoá", ten == "Bánh nướng nhỏ cho quán cà phê", ten)
        ghi("Đường dẫn dùng mã khoá ổn định", "#/khoa/banh-nuong-nho" in pg.url, pg.url)

        await pg.locator(".save").click()
        await pg.wait_for_timeout(200)
        ghi("Lưu khoá: nút đổi chữ, bộ đếm tăng", "Đã lưu" in await pg.locator(".save").inner_text() and await pg.locator(".count").first.inner_text() == "1")
        await pg.reload()
        await pg.wait_for_selector(".board")
        ghi("Tải lại vẫn giữ khoá đã lưu", "Đã lưu" in await pg.locator(".save").inner_text())

        await pg.locator("text=Khoá tiếp theo →").click()
        await pg.wait_for_timeout(300)
        ghi("Khoá tiếp theo", await pg.locator(".lesson-heading h1").inner_text() == "Tính giá vốn cho bếp bánh")

        await pg.locator("#layout").click()
        await pg.wait_for_timeout(100)
        ghi("Nút đổi cách xếp giấy", await pg.locator(".board.collage").count() == 1)

        ghi("Bản xem thử: học viên mẫu đang học khoá này thấy Vào học", (await pg.locator(".cta").inner_text()).startswith("Vào học"))
        await pg.goto("http://localhost:8771/#/khoa/croissant-ngan-lop")
        await pg.wait_for_selector(".board")
        await pg.locator(".cta").click()
        await pg.wait_for_selector("dialog.hop[open]")
        noi_dung = await pg.locator("dialog.hop textarea").input_value()
        ghi("Khoá chưa ghi danh: Giữ chỗ mở hộp để lại số, điền sẵn tên khoá", "Croissant" in noi_dung, noi_dung)
        await pg.locator("dialog.hop .gui").click()
        ghi("Thiếu số điện thoại thì báo và giữ hộp", "cho xin số" in await pg.locator("#lh-trang-thai").inner_text())
        await pg.keyboard.press("Escape")
        await pg.wait_for_timeout(200)
        ghi("Esc đóng hộp", await pg.locator("dialog.hop[open]").count() == 0)

        await pg.locator(".breadcrumb a").first.click()
        await pg.wait_for_selector(".folder")
        ghi("Trở về tủ", await pg.locator(".board").count() == 0)

        await pg.locator(".right .nut").first.click()
        await pg.locator("#tim").fill("bo chay")
        await pg.wait_for_timeout(200)
        ten_loc = await pg.locator(".folder .tab:not(.alt-tab)").all_inner_texts()
        ghi("Tìm không dấu ra khoá có nguyên liệu 'Bơ chảy'", ten_loc == ["Bûche de Noël"], str(ten_loc))
        await pg.locator("#tim").fill("không có món này")
        await pg.wait_for_timeout(200)
        ghi("Tìm không ra thì có câu gợi ý", "Chưa tìm thấy" in await pg.locator("#empty").inner_text())

        await pg.locator("nav a", has_text="Đã lưu").click()
        await pg.wait_for_timeout(300)
        ten_luu = await pg.locator(".folder .tab:not(.alt-tab)").all_inner_texts()
        ghi("Mục Đã lưu chỉ hiện khoá đã lưu", ten_luu == ["Bánh nướng nhỏ cho quán cà phê"], str(ten_luu))

        await pg.locator("nav button", has_text="Cách học").click()
        ghi("Cách học mở hộp giới thiệu", await pg.locator("dialog.info[open]").count() == 1)
        await pg.keyboard.press("Escape")

        await pg.goto("http://localhost:8771/#/khoa/khong-co")
        await pg.wait_for_timeout(500)
        ghi("Khoá không tồn tại báo rõ, có đường về", "Không tìm thấy khoá" in await pg.locator("#lesson").inner_text())

        for w in (390, 320):
            m = await b.new_page(viewport={"width": w, "height": 800}, device_scale_factor=2, has_touch=True, is_mobile=True)
            await chan_font(m)
            await m.goto("http://localhost:8771/")
            await m.wait_for_selector(".folder")
            await m.wait_for_timeout(500)
            rong = await m.evaluate("document.documentElement.scrollWidth")
            cat = await m.evaluate("[...document.querySelectorAll('.folder .tab:not(.alt-tab) .tab-chu')].filter(e => e.scrollWidth > e.clientWidth).length")
            de = await m.evaluate("""(() => { const l = document.querySelector('.logo').getBoundingClientRect();
              return [...document.querySelectorAll('nav .nut')].filter(n => getComputedStyle(n).display !== 'none' && n.getBoundingClientRect().right > l.left).length })()""")
            ghi(f"{w}px: không tràn ngang, không tên ngăn nào bị cắt, menu không đè logo", rong == w and cat == 0 and de == 0, f"rộng {rong}, cắt {cat}, đè {de}")
            await m.locator(".folder .tab:not(.alt-tab)").nth(0).tap()
            await m.wait_for_selector(".board")
            ghi(f"{w}px: chạm tên ngăn mở trang giấy", True)
            ghi(f"{w}px: trang giấy không tràn ngang", await m.evaluate("document.documentElement.scrollWidth") == w)
            await m.close()

        r = await b.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        await chan_font(r)
        await r.goto("http://localhost:8771/")
        await r.wait_for_selector(".folder")
        td = await r.locator(".folder-content").first.evaluate("e => getComputedStyle(e).transitionDuration")
        ghi("Giảm chuyển động: tắt hiệu ứng mở ngăn", td in ("0s", "0s, 0s"), td)
        ghi("Không lỗi JavaScript trên bản xem thử", not loi, "; ".join(loi))
    finally:
        srv.kill()


def dung_ban_that():
    d = Path(tempfile.mkdtemp())
    shutil.copytree(GOC / "sonneto" / "public" / "frontend", d / "assets" / "sonneto" / "frontend")
    (d / "index.html").write_text((GOC / "sonneto" / "www" / "sonneto.html").read_text(encoding="utf-8"), encoding="utf-8")
    return d


KHOA = [{"ma": "fraisier", "ten": "Fraisier và entremets", "moTa": "Dựng bánh nhiều lớp.", "hinhThuc": "Online", "soBai": 12,
         "soNgayHoc": 180, "hoSo": {"mau": None, "lamDuoc": "Dựng một chiếc fraisier.", "baiTieuBieu": ["Bông lan joconde"],
                                    "phieuCan": {"ten": "Mousse vani", "dong": [["Sữa tươi", "250 g"]]}}},
        {"ma": "tart", "ten": "Tart theo mùa", "moTa": "Vỏ giòn.", "hinhThuc": "Tại bếp", "thoiLuong": "1 ngày", "hoSo": {}}]


async def phan_ban_that(b):
    d = dung_ban_that()
    srv = phuc_vu(d, 8772)
    try:
        async def mo(che_do, dang_nhap=None, ghi_danh=None):
            pg = await b.new_page(viewport={"width": 1440, "height": 900})
            await chan_font(pg)
            if dang_nhap:
                await pg.context.add_cookies([{"name": "user_id", "value": dang_nhap, "url": "http://localhost:8772"}])
            dem = {"n": 0}

            async def api(route):
                dem["n"] += 1
                if che_do == "loi" and dem["n"] == 1:
                    return await route.fulfill(status=500, body="{}")
                if che_do == "cham":
                    await asyncio.sleep(1.2)
                du_lieu = [] if che_do == "rong" else KHOA
                await route.fulfill(status=200, content_type="application/json", body=json.dumps({"message": du_lieu}))

            async def cua_toi(route):
                await route.fulfill(status=200, content_type="application/json",
                                    body=json.dumps({"message": {"hocVien": {"ten": "Lan", "homNay": "2026-11-01"}, "khoaHoc": [], "ghiDanh": ghi_danh or []}}))

            await pg.route("**/api/method/sonneto.api.danh_sach_khoa", api)
            await pg.route("**/api/method/sonneto.api.khoa_cua_toi", cua_toi)
            return pg

        pg = await mo("cham")
        await pg.goto("http://localhost:8772/")
        await pg.wait_for_timeout(400)
        ghi("Bản thật: đang tải thì báo đang mở tủ", "Đang mở tủ" in await pg.locator(".st").inner_text())
        await pg.wait_for_selector(".folder")
        ghi("Bản thật: tải xong hiện ngăn từ API", await pg.locator(".folder").count() == 2)
        dn = await pg.locator(".right .tai-khoan").get_attribute("href")
        ghi("Khách chưa đăng nhập thấy nút Đăng nhập tới trang đăng nhập Frappe", dn == "/login?redirect-to=/khoa-cua-toi", dn)
        await pg.close()

        pg = await mo("rong")
        await pg.goto("http://localhost:8772/")
        await pg.wait_for_timeout(600)
        ghi("Bản thật: chưa có khoá thì báo và mời để lại số", "Tủ đang được xếp" in await pg.locator(".st").inner_text())
        await pg.close()

        pg = await mo("loi")
        await pg.goto("http://localhost:8772/")
        await pg.wait_for_selector("text=Chưa mở được tủ")
        await pg.locator("text=Thử lại").click()
        await pg.wait_for_selector(".folder")
        ghi("Bản thật: lỗi máy chủ thì báo, bấm Thử lại thì tải được", True)
        await pg.close()

        pg = await mo("thuong", dang_nhap="lan@vd.vn", ghi_danh=[{"khoa": "fraisier", "hetHan": "2027-03-19", "baiTiep": "do-mousse"},
                                                                {"khoa": "tart", "hetHan": "2026-10-02"}])
        await pg.goto("http://localhost:8772/khoa/fraisier")
        await pg.wait_for_selector(".board")
        await pg.wait_for_timeout(400)
        href = await pg.locator(".cta").get_attribute("href")
        ghi("Học viên còn hạn: nút Vào học tới bài đang học", href == "/hoc/fraisier/do-mousse", str(href))
        ghi("Học viên đăng nhập thấy Khoá của tôi", await pg.locator(".right .tai-khoan").inner_text() == "Khoá của tôi")
        await pg.goto("http://localhost:8772/khoa/tart")
        await pg.wait_for_selector(".board")
        await pg.wait_for_timeout(400)
        ghi("Học viên hết hạn: nút Gia hạn khoá này", await pg.locator(".cta").inner_text() == "Gia hạn khoá này")
        ghi("Khoá chưa có phiếu cân vẫn hiện trang giấy gọn", await pg.locator(".recipe-columns.mot-cot").count() == 1)
        await pg.close()
    finally:
        srv.kill()
        shutil.rmtree(d, ignore_errors=True)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await phan_xem_thu(b)
        await phan_ban_that(b)
        await b.close()
    hong = [t for t, d in KQ if not d]
    print(f"\n{len(KQ) - len(hong)} trên {len(KQ)} đạt")
    sys.exit(1 if hong else 0)


asyncio.run(main())
