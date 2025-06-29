from django.contrib.auth.mixins import UserPassesTestMixin

class IsAdminMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.user_type == 'ADMIN'

class IsDeveloperMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.user_type == 'DEVELOPER'

class IsBuyerMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.user_type == 'CUSTOMER'