var express = require('express');
var router = express.Router();
const md5 = require("md5")

const fs = require("fs");

const YL = "@lxf@"
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post('/login', function (req, res, next) {
  fs.readFile("./data/user.json", function (err, data) {
    let obj = req.body;
    d = JSON.parse(data);
    let xf = 0;
    let key = "";
    for (let i in d) {
      if (d[i].name == obj.name) {
        xf = 1;
        key = d[i].key;
        if (d[i].pass == md5(YL+obj.pass)) {
          xf = 888;
        }
      }
    }
    if (xf == 0) {
      res.json({
        ok: 0,
        msg: "您输入的账号不存在"
      })
    } else if (xf == 1) {
      res.json({
        ok: 1,
        msg: "密码输入错误"
      })
    } else if (xf == 888) {
      res.json({
        ok: 888,
        msg: "登录成功",
        key
      })
    }
  })
});

//获取用户名
router.post('/userYZ', function (req, res, next) {
  let obj = req.body.key;

  fs.readFile("./data/user.json", function (err, data) {
    d = JSON.parse(data);
    let xf = 0;
    let name = "";
    for (let i in d) {
      if (d[i].key == obj) {
        xf = 1;
        name = d[i].name;
      }
    }
    if (xf == 0) {
      res.json({
        ok: 0,
        msg: "账号不存在"
      })
    } else if (xf == 1) {
      res.json({
        ok: 1,
        msg: "请求成功",
        name
      })
    }
  })
});
//修改信息
router.post('/upUser', function (req, res, next) {
  let query = req.body
  let key = query.key;
  if (query.touziyear && query.email && query.telphone && query.nickname) {
  fs.readFile("./data/personalInfo.json", function (err, data) {
    d = JSON.parse(data);
    let arr = [];
    let is = false;
    let idx = 0;
    d.users.forEach((e, index) => {
      if (e.personalInfo.key == key) {
        idx = index
        e.personalInfo.user.nickname = query.nickname;
        e.personalInfo.user.touziyear = query.touziyear;
        e.personalInfo.user.email = query.email;
        e.personalInfo.user.telphone = query.telphone;
        is = !is;
        arr = e.personalInfo.user;
        return;
      } 
    });
    if (!is) {
      res.json({
        ok: 0,
        msg: "key错误"
      })
    } else {
      d.users[idx].personalInfo.user = arr;
      fs.writeFile("./data/personalInfo.json", JSON.stringify(d), function (err) {
        if (!err) {
          res.json({
            ok: 1,
            msg: "修改成功",
            data: d.users[idx].personalInfo.user
          })
        } else {
          res.json({
            ok: 0,
            msg: "网络错误"
          })
        }
      })
    }


  })
  }else{
    res.json({
      ok:-2,
      msg:"参数错误"
    })
  }
});

//修改密码
router.post('/upPass', function (req, res, next) {
  let query = req.body;
  let pass1 = query.pass1;
  let pass2 = query.pass2;

  fs.readFile("./data/user.json", function (err, data) {
    d = JSON.parse(data);
    let is = false;
    let isKey =false;
    for (let i=0;i<d.length;i++) {
      if (query.key==d[i].key) {
        if (md5(YL + pass1) == d[i].pass) {
          is = !is;
          d[i].pass = md5(YL + pass2);
        }
        isKey = !isKey;
      }
      
    }
    if(isKey){
      if (is) {
        fs.writeFile("./data/user.json", JSON.stringify(d), function (err) {
          if (!err) {
            res.json({
              ok: 1,
              msg: "修改成功"
            })
          } else {
            res.json({
              ok: -1,
              msg: "修改失败"
            })
          }
        })

      } else {
        res.json({
          ok: 0,
          msg: "旧密码错误"
        })
      }
    }else{
      res.json({
        ok:-2,
        msg:"key失效"
      })
    }
    
  })
});

//手机服务
router.post('/upFuWu', function (req, res, next) {
  let query = req.body
  let key = query.key;
  fs.readFile("./data/personalInfo.json", function (err, data) {
    d = JSON.parse(data);
    let arr = [];
    let is = false;
    let idx = 0;
    d.users.forEach((e, index) => {
      if (e.personalInfo.key == key) {
        idx = index
        e.personalInfo.user.telphone = query.telphone;
        e.personalInfo.user.baseType = query.baseType;
        e.personalInfo.user.changeType = query.changeType;
        is = !is;
        arr = e.personalInfo.user;
        return
      }

    });
    if (!is) {
      res.json({
        ok: 0,
        msg: "key错误"
      })
    } else {
      d.users[idx].personalInfo.user = arr;
      fs.writeFile("./data/personalInfo.json", JSON.stringify(d), function (err) {
        if (!err) {
          res.json({
            ok: 1,
            msg: "修改成功",
            data: d.users[idx].personalInfo.user
          })
        } else {
          res.json({
            ok: 0,
            msg: "网络错误"
          })
        }
      })
    }


  })
});
module.exports = router;