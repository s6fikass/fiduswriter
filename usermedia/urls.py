from django.conf.urls import url

from . import views

urlpatterns = [
    url('^$', views.index, name='index'),
    url('^save/$', views.save_js, name='save_js'),
    url('^save_css/$', views.save_css, name='save_css'),
    url('^delete/$', views.delete_js, name='delete_js'),
    url('^images/$', views.images_js, name='images_js'),
    url('^styles/$', views.styles_js, name='styles_js'),
    url('^save_category/$', views.save_category_js, name='save_category_js'),
    url(
        '^delete_category/$',
        views.delete_category_js,
        name='delete_category_js'
    )
]
