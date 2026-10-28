"""Hook trên LMS Enrollment và việc chạy hằng ngày. Không đặt hook trên "*"."""

import frappe
from frappe.utils import today

from sonneto import han_hoc


def dat_han_khi_ghi_danh(doc, method=None):
    """Ghi danh mới (mua khoá hoặc được thêm tay) tự có ngày hết hạn theo số ngày học của khoá.
    Người quản lý điền tay ngày hết hạn thì giữ nguyên."""
    if doc.get("sonneto_het_han"):
        return
    so_ngay = frappe.db.get_value("LMS Course", doc.course, "sonneto_so_ngay_hoc")
    doc.sonneto_het_han = han_hoc.tinh_het_han(today(), so_ngay)


def nhac_sap_het_han():
    """Chạy mỗi sáng: email nhắc học viên còn đúng 14 ngày hoặc 3 ngày."""
    hom_nay = today()
    for g in frappe.get_all("LMS Enrollment", filters={"sonneto_het_han": [">=", hom_nay]},
                            fields=["name", "member", "course", "sonneto_het_han"]):
        if not han_hoc.can_nhac(g.sonneto_het_han, hom_nay):
            continue
        ten_khoa = frappe.db.get_value("LMS Course", g.course, "title")
        con = han_hoc.con_lai(g.sonneto_het_han, hom_nay)
        frappe.sendmail(
            recipients=[g.member],
            subject=f"Khoá {ten_khoa} còn {con} ngày học",
            message=(
                f"<p>Khoá <b>{frappe.utils.escape_html(ten_khoa)}</b> của anh chị còn {con} ngày học, "
                f"tới hết ngày {frappe.utils.formatdate(g.sonneto_het_han, 'dd/MM/yyyy')}.</p>"
                "<p>Học tiếp tại trang Khoá của tôi. Hết hạn vẫn gia hạn được, tiến độ giữ nguyên.</p>"
            ),
            reference_doctype="LMS Enrollment",
            reference_name=g.name,
        )
