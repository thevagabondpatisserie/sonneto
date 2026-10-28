"""Chạy: python3 -m unittest sonneto.kiem_thu.test_han_hoc (không cần Frappe)."""

import unittest
from datetime import date

from sonneto import han_hoc as h


class TestHanHoc(unittest.TestCase):
    def test_mac_dinh_6_thang(self):
        self.assertEqual(h.so_ngay_hoc(None), 180)
        self.assertEqual(h.so_ngay_hoc(""), 180)
        self.assertEqual(h.so_ngay_hoc("abc"), 180)
        self.assertEqual(h.so_ngay_hoc(0), 180)
        self.assertEqual(h.so_ngay_hoc(-5), 180)
        self.assertEqual(h.so_ngay_hoc(" 90 "), 90)

    def test_het_han_tinh_ca_ngay_dau(self):
        self.assertEqual(h.tinh_het_han("2026-10-28", 1), date(2026, 10, 28))
        self.assertEqual(h.tinh_het_han("2026-10-28", 180), date(2027, 4, 25))

    def test_con_lai_va_quyen_hoc(self):
        self.assertEqual(h.con_lai("2026-10-28", "2026-10-28"), 0)
        self.assertTrue(h.con_hoc_duoc("2026-10-28", "2026-10-28"))
        self.assertFalse(h.con_hoc_duoc("2026-10-27", "2026-10-28"))
        self.assertTrue(h.con_hoc_duoc(None, "2026-10-28"))

    def test_gia_han(self):
        # còn hạn: nối tiếp, không mất ngày
        self.assertEqual(h.han_moi_khi_gia_han("2026-11-06", "2026-10-28", 180), date(2027, 5, 5))
        # đã hết: tính từ hôm nay
        self.assertEqual(h.han_moi_khi_gia_han("2026-10-02", "2026-10-28", 180), date(2027, 4, 25))
        # chưa từng có hạn
        self.assertEqual(h.han_moi_khi_gia_han(None, "2026-10-28", 30), date(2026, 11, 26))

    def test_nhac(self):
        self.assertTrue(h.can_nhac("2026-11-11", "2026-10-28"))
        self.assertTrue(h.can_nhac("2026-10-31", "2026-10-28"))
        self.assertFalse(h.can_nhac("2026-11-01", "2026-10-28"))

    def test_sdt(self):
        self.assertEqual(h.chuan_hoa_sdt("0909 123 456"), "0909123456")
        self.assertEqual(h.chuan_hoa_sdt("+84 909-123-456"), "+84909123456")
        self.assertIsNone(h.chuan_hoa_sdt("12345"))
        self.assertIsNone(h.chuan_hoa_sdt(None))


if __name__ == "__main__":
    unittest.main()
