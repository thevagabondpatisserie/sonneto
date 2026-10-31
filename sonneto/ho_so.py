"""Phép thuần cho hồ sơ khoá ở trang chủ (không cần Frappe, kiểm thử được)."""


def _so(x):
    return f"{x:g}" if isinstance(x, (int, float)) else str(x)


def phieu_can_tu_cong_thuc(ct, so_dong=5):
    """Rút tối đa so_dong dòng nguyên liệu từ JSON công thức của một bài để in lên phiếu cân.

    Trả None khi công thức trống hoặc không có dòng nào dùng được.
    """
    if not isinstance(ct, dict):
        return None
    dong = []
    for nl in ct.get("nguyenLieu") or []:
        if not isinstance(nl, dict) or not nl.get("ten"):
            continue
        if nl.get("gam") is not None:
            dong.append([nl["ten"], f"{_so(nl['gam'])} g"])
        elif nl.get("soLuong") is not None:
            dong.append([nl["ten"], f"{_so(nl['soLuong'])} {nl.get('donVi') or ''}".strip()])
        if len(dong) >= so_dong:
            break
    return {"ten": ct.get("ten") or "", "dong": dong} if dong else None
