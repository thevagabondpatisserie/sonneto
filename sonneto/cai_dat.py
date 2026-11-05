"""Chạy sau mỗi lần migrate: thêm các trường Sonneto vào doctype của Frappe Learning."""

from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

TRUONG = {
    "LMS Course": [
        {"fieldname": "sonneto_section", "fieldtype": "Section Break", "label": "Sonneto", "insert_after": "category"},
        {"fieldname": "sonneto_so_ngay_hoc", "fieldtype": "Int", "label": "Số ngày được học", "default": "180",
         "description": "Tính từ ngày ghi danh. Để trống là 180 ngày (6 tháng).", "insert_after": "sonneto_section"},
        {"fieldname": "sonneto_hinh_thuc", "fieldtype": "Select", "label": "Hình thức", "options": "Online\nTại bếp",
         "default": "Online", "insert_after": "sonneto_so_ngay_hoc"},
        {"fieldname": "sonneto_thoi_luong", "fieldtype": "Data", "label": "Thời lượng (lớp tại bếp)",
         "description": "Ví dụ: 1 ngày. Khoá online để trống, web tự hiện số bài.", "insert_after": "sonneto_hinh_thuc"},
        {"fieldname": "sonneto_anh_mo_ta", "fieldtype": "Data", "label": "Mô tả ảnh",
         "description": "Người trong ảnh đang làm gì. Dùng cho người khiếm thị và Google.", "insert_after": "sonneto_thoi_luong"},
        {"fieldname": "sonneto_mau_bia", "fieldtype": "Select", "label": "Màu ngăn ở trang chủ",
         "options": "\nMận\nCam\nXanh rêu\nĐỏ\nTím\nXanh dương\nHồng",
         "description": "Màu ngăn của khoá trong tủ ở trang chủ. Để trống thì web tự xếp màu theo thứ tự ngăn.",
         "insert_after": "sonneto_anh_mo_ta"},
        {"fieldname": "sonneto_lam_duoc", "fieldtype": "Small Text", "label": "Học xong làm được gì",
         "description": "Một hai câu, hiện trên tờ giấy hồng khi khách mở hồ sơ khoá.",
         "insert_after": "sonneto_mau_bia"},
    ],
    "LMS Enrollment": [
        {"fieldname": "sonneto_het_han", "fieldtype": "Date", "label": "Học được tới ngày",
         "description": "Tự điền khi ghi danh. Sửa tay để gia hạn riêng cho một học viên.", "insert_after": "course"},
    ],
    "Course Lesson": [
        {"fieldname": "sonneto_section", "fieldtype": "Section Break", "label": "Sonneto", "insert_after": "assessments"},
        {"fieldname": "sonneto_thoi_luong", "fieldtype": "Data", "label": "Độ dài video", "description": "Ví dụ 22:10",
         "insert_after": "sonneto_section"},
        {"fieldname": "sonneto_anh_video", "fieldtype": "Attach Image", "label": "Ảnh bìa video", "insert_after": "sonneto_thoi_luong"},
        {"fieldname": "sonneto_cong_thuc", "fieldtype": "Code", "options": "JSON", "label": "Công thức (gram)",
         "insert_after": "sonneto_anh_video"},
        {"fieldname": "sonneto_cac_buoc", "fieldtype": "Code", "options": "JSON", "label": "Các bước gắn phút",
         "insert_after": "sonneto_cong_thuc"},
    ],
}


def after_migrate():
    create_custom_fields(TRUONG, ignore_validate=True, update=True)
