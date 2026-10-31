app_name = "sonneto"
app_title = "Sonneto"
app_publisher = "Công ty TNHH Patisserie Vagabond"
app_description = "Web Sonneto: trang giới thiệu, khoá học có hạn học, R&D cho quán"
app_email = "thevagabondbakery@gmail.com"
app_license = "unlicensed"

required_apps = ["lms"]

# Trang chủ và hai màn ứng dụng do giao diện Vue (thư mục frontend) vẽ.
# Chỉ khai đúng các đường này, không bắt "/<path>" để khỏi đè /login, /lms, /app.
home_page = "sonneto"
website_route_rules = [
    {"from_route": "/khoa-cua-toi", "to_route": "sonneto"},
    {"from_route": "/hoc/<path:app_path>", "to_route": "sonneto"},
]

after_install = ["sonneto.cai_dat.after_migrate"]  # site mới cài cũng có trường ngay, không chờ migrate
after_migrate = ["sonneto.cai_dat.after_migrate"]

doc_events = {
    "LMS Enrollment": {
        "before_insert": "sonneto.su_kien.dat_han_khi_ghi_danh",
    },
}

scheduler_events = {
    "daily": ["sonneto.su_kien.nhac_sap_het_han"],
}
