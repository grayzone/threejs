package routers

import (
	"github.com/astaxie/beego"
	"github.com/grayzone/threejs/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
}
