from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

class DashboardSummaryTests(TestCase):
    @override_settings(DASHBOARD_USE_MOCK=True)
    def test_summary_mock(self):
        client = APIClient()
        url = reverse("dashboard-summary")
        resp = client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("total", data)
        self.assertIn("recientes", data)