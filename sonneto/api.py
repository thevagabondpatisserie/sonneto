"""Các hàm giao diện Vue gọi qua /api/method/sonneto.api.<tên>.

Dữ liệu khoá học, bài học, ghi danh, tiến độ lấy từ Frappe Learning (app lms).
Hạn học, công thức theo gram và các bước gắn phút là trường Sonneto thêm vào
(xem cai_dat.py).
"""

import json

import frappe
from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.utils import today

from sonneto import han_hoc


def _anh(url):
    return url or "/assets/sonneto/frontend/anh/8054.jpg"


@frappe.whitelist(allow_guest=True)
def danh_sach_khoa():
    """Khoá học đang mở, cho trang chủ."""
    khoa = frappe.get_all(
        "LMS Course",
        filters={"published": 1},
        fields=["name", "title", "short_introduction", "image", "lessons",
                "sonneto_hinh_thuc", "sonneto_thoi_luong", "sonneto_anh_mo_ta"],
        order_by="featured desc, published_on desc",
    )
    return [
        {
            "ma": k.name,
            "ten": k.title,
            "moTa": k.short_introduction,
            "anh": _anh(k.image),
            "anhMoTa": k.sonneto_anh_mo_ta or k.title,
            "hinhThuc": k.sonneto_hinh_thuc or "Online",
            "soBai": k.lessons or None,
            "thoiLuong": k.sonneto_thoi_luong,
        }
        for k in khoa
    ]


def _can_dang_nhap():
    if frappe.session.user == "Guest":
        raise frappe.PermissionError(_("Cần đăng nhập để xem mục này."))


@frappe.whitelist()
def khoa_cua_toi():
    """Các khoá học viên đang ghi danh, kèm hạn học và tiến độ."""
    _can_dang_nhap()
    user = frappe.session.user
    ghi_danh = frappe.get_all(
        "LMS Enrollment",
        filters={"member": user, "member_type": "Student"},
        fields=["course", "current_lesson", "sonneto_het_han"],
        order_by="modified desc",
    )
    ma_khoa = [g.course for g in ghi_danh]
    khoa = danh_sach_khoa_theo_ma(ma_khoa)
    da_hoc = {
        r.course: r.so
        for r in frappe.get_all(
            "LMS Course Progress",
            filters={"member": user, "status": "Complete", "course": ["in", ma_khoa or [""]]},
            fields=["course", "count(name) as so"],
            group_by="course",
        )
    }
    return {
        "hocVien": {"ten": frappe.db.get_value("User", user, "first_name") or "", "homNay": today()},
        "khoaHoc": khoa,
        "ghiDanh": [
            {
                "khoa": g.course,
                "daHoc": da_hoc.get(g.course, 0),
                "hetHan": str(g.sonneto_het_han) if g.sonneto_het_han else None,
                "baiTiep": g.current_lesson or _bai_dau(g.course),
            }
            for g in ghi_danh
        ],
    }


def danh_sach_khoa_theo_ma(ma_khoa):
    if not ma_khoa:
        return []
    rows = frappe.get_all(
        "LMS Course",
        filters={"name": ["in", ma_khoa]},
        fields=["name", "title", "image", "lessons", "sonneto_hinh_thuc"],
    )
    return [
        {"ma": r.name, "ten": r.title, "anh": _anh(r.image), "soBai": r.lessons, "hinhThuc": r.sonneto_hinh_thuc}
        for r in rows
    ]


def _bai_dau(khoa):
    chuong = frappe.get_all("Chapter Reference", filters={"parent": khoa}, fields=["chapter"], order_by="idx asc", limit=1)
    if not chuong:
        return None
    bai = frappe.get_all("Lesson Reference", filters={"parent": chuong[0].chapter}, fields=["lesson"], order_by="idx asc", limit=1)
    return bai[0].lesson if bai else None


@frappe.whitelist()
def bai_hoc(khoa, bai):
    """Một bài học. Chặn khi chưa ghi danh hoặc đã hết hạn học."""
    _can_dang_nhap()
    user = frappe.session.user
    gd = frappe.db.get_value(
        "LMS Enrollment", {"member": user, "course": khoa}, ["name", "sonneto_het_han"], as_dict=True
    )
    if not gd:
        raise frappe.PermissionError(_("Anh chị chưa ghi danh khoá này."))
    if not han_hoc.con_hoc_duoc(gd.sonneto_het_han, today()):
        raise frappe.PermissionError(_("Khoá học đã hết hạn. Gia hạn để học tiếp, tiến độ vẫn giữ."))

    b = frappe.get_doc("Course Lesson", bai)
    if b.course != khoa:
        raise frappe.PermissionError(_("Bài học không thuộc khoá này."))
    c = frappe.db.get_value("LMS Course", khoa, ["title", "lessons"], as_dict=True)

    return {
        "ma": b.name,
        "khoa": khoa,
        "tenKhoa": c.title,
        "hetHan": str(gd.sonneto_het_han) if gd.sonneto_het_han else None,
        "homNay": today(),
        "ten": b.title,
        "tongBai": c.lessons,
        "thuTu": _thu_tu_bai(khoa, b.name),
        "thoiLuong": b.get("sonneto_thoi_luong") or "",
        "anhVideo": _anh(b.get("sonneto_anh_video")),
        "congThuc": _json(b.get("sonneto_cong_thuc"), {"ten": "", "nguyenLieu": [], "choBaoNhieu": {}}),
        "cacBuoc": _json(b.get("sonneto_cac_buoc"), []),
        "danhSach": _danh_sach_bai(khoa, user),
    }


def _json(chuoi, mac_dinh):
    try:
        return json.loads(chuoi) if chuoi else mac_dinh
    except ValueError:
        frappe.log_error(title="Sonneto: công thức hoặc các bước không đọc được", message=str(chuoi)[:2000])
        return mac_dinh


def _danh_sach_bai(khoa, user):
    xong = set(frappe.get_all("LMS Course Progress", filters={"member": user, "course": khoa, "status": "Complete"}, pluck="lesson"))
    ds = []
    for ch in frappe.get_all("Chapter Reference", filters={"parent": khoa}, fields=["chapter"], order_by="idx asc"):
        ten_chuong = frappe.db.get_value("Course Chapter", ch.chapter, "title")
        bai = []
        for lr in frappe.get_all("Lesson Reference", filters={"parent": ch.chapter}, fields=["lesson"], order_by="idx asc"):
            l = frappe.db.get_value("Course Lesson", lr.lesson, ["name", "title", "sonneto_thoi_luong"], as_dict=True)
            if l:
                bai.append({"ma": l.name, "ten": l.title, "thoiLuong": l.sonneto_thoi_luong or "", "xong": l.name in xong})
        ds.append({"phan": ten_chuong, "bai": bai})
    return ds


def _thu_tu_bai(khoa, bai):
    i = 0
    for p in _danh_sach_bai(khoa, frappe.session.user):
        for b in p["bai"]:
            i += 1
            if b["ma"] == bai:
                return i
    return None


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=5, seconds=60 * 60)
def gui_yeu_cau(can=None, ten=None, sdt=None, loi_nhan=None):
    """Form "Để lại số" ở trang chủ. Giới hạn 5 lần mỗi giờ mỗi địa chỉ mạng."""
    so = han_hoc.chuan_hoa_sdt(sdt)
    if not so:
        frappe.throw(_("Anh chị cho xin số điện thoại hoặc Zalo để Sonneto gọi lại."))
    frappe.get_doc({
        "doctype": "Yeu Cau Lien He",
        "quan_tam": "Làm bánh cho quán" if can == "quan" else "Khoá học",
        "ten": (ten or "")[:140],
        "so_dien_thoai": so,
        "loi_nhan": (loi_nhan or "")[:2000],
    }).insert(ignore_permissions=True)
    return "ok"
