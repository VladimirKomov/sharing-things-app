from django.contrib import admin

from dashboard.dashboard_models import UserSettings


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name')
