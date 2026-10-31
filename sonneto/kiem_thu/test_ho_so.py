import unittest

from sonneto.ho_so import phieu_can_tu_cong_thuc


class TestPhieuCan(unittest.TestCase):
    def test_lay_gam_va_so_luong(self):
        ct = {"ten": "Mousse vani", "nguyenLieu": [
            {"ten": "Sữa tươi", "gam": 250}, {"ten": "Gelatin lá", "gam": 7.5}, {"ten": "Vani", "soLuong": 1, "donVi": "trái"}]}
        self.assertEqual(phieu_can_tu_cong_thuc(ct), {"ten": "Mousse vani", "dong": [
            ["Sữa tươi", "250 g"], ["Gelatin lá", "7.5 g"], ["Vani", "1 trái"]]})

    def test_toi_da_nam_dong(self):
        ct = {"ten": "x", "nguyenLieu": [{"ten": str(i), "gam": i} for i in range(9)]}
        self.assertEqual(len(phieu_can_tu_cong_thuc(ct)["dong"]), 5)

    def test_bo_dong_hong_va_cong_thuc_trong(self):
        self.assertIsNone(phieu_can_tu_cong_thuc(None))
        self.assertIsNone(phieu_can_tu_cong_thuc({"nguyenLieu": []}))
        self.assertIsNone(phieu_can_tu_cong_thuc({"nguyenLieu": [{"gam": 5}, "rac", {"ten": "Muối"}]}))
        self.assertIsNone(phieu_can_tu_cong_thuc([1, 2]))


if __name__ == "__main__":
    unittest.main()
