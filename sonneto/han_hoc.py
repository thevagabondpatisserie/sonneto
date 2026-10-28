"""Phép thuần về hạn học. Không chạm Frappe để kiểm thử được không cần site."""

from datetime import date, timedelta

SO_NGAY_MAC_DINH = 180  # 6 tháng, anh Việt chốt 26/10/2026; sửa được theo từng khoá
NGUONG_SAP_HET = 14     # dưới 14 ngày thì nhãn đổi màu cảnh báo
NHAC_TRUOC = (14, 3)    # gửi email nhắc khi còn đúng 14 ngày và 3 ngày


def doc_ngay(x):
    """Nhận date, datetime hoặc chuỗi yyyy-mm-dd, trả về date. None giữ None."""
    if x is None or x == "":
        return None
    if isinstance(x, date):
        return x if type(x) is date else x.date()
    return date.fromisoformat(str(x)[:10])


def so_ngay_hoc(gia_tri_khoa):
    """Số ngày học của một khoá. Ô để trống, số âm, chữ lạ: dùng mặc định 6 tháng."""
    try:
        n = int(str(gia_tri_khoa).strip())
    except (TypeError, ValueError):
        return SO_NGAY_MAC_DINH
    return n if n > 0 else SO_NGAY_MAC_DINH


def tinh_het_han(ngay_bat_dau, so_ngay):
    """Ngày cuối cùng còn được học. Ghi danh hôm nay, 180 ngày: học được tới hết ngày thứ 180."""
    bat_dau = doc_ngay(ngay_bat_dau)
    return bat_dau + timedelta(days=so_ngay_hoc(so_ngay) - 1)


def con_lai(het_han, hom_nay):
    """Số ngày còn lại tính cả hôm nay là 0. Âm là đã hết hạn. Không có hạn: None."""
    h = doc_ngay(het_han)
    if h is None:
        return None
    return (h - doc_ngay(hom_nay)).days


def con_hoc_duoc(het_han, hom_nay):
    """Còn được vào học không. Ghi danh cũ chưa có hạn (trước khi cài app) thì cho học."""
    n = con_lai(het_han, hom_nay)
    return n is None or n >= 0


def han_moi_khi_gia_han(het_han_cu, hom_nay, so_ngay):
    """Gia hạn: còn hạn thì cộng nối tiếp, đã hết thì tính lại từ hôm nay."""
    cu = doc_ngay(het_han_cu)
    nay = doc_ngay(hom_nay)
    if cu is not None and cu >= nay:
        return cu + timedelta(days=so_ngay_hoc(so_ngay))
    return tinh_het_han(nay, so_ngay)


def can_nhac(het_han, hom_nay):
    """Hôm nay có phải gửi email nhắc sắp hết hạn không."""
    return con_lai(het_han, hom_nay) in NHAC_TRUOC


def chuan_hoa_sdt(chuoi):
    """Giữ chữ số và dấu + đầu. Trả về None nếu ít hơn 9 chữ số."""
    s = str(chuoi or "").strip()
    dau = "+" if s.startswith("+") else ""
    so = "".join(c for c in s if c.isdigit())
    return dau + so if len(so) >= 9 else None
