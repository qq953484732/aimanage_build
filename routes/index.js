var express = require('express');
var router = express.Router();
const fs = require("fs")
const md5 = require("md5")
const YL = "@lxf@"
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');

});

//用户列表
router.get('/getUserInfo', function (req, res, next) {
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  fs.readFile("./data/getUserInfo.json", function (err, data) {
    data = JSON.parse(data);
    max = data.data.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    let infoList = data.data.slice(limit, limitEnd)

    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList,
        pageIndex
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
// 信息列表
router.get('/getInfoList', function (req, res, next) {
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/getInfoList.json", function (err, data) {
    data = JSON.parse(data);
    max = data.data.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    let infoList = data.data.slice(limit, limitEnd)
    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList,
        pageIndex
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});

//信息管理
router.get('/getPersonalInfo', function (req, res, next) {
  let key = req.query.key;
  fs.readFile("./data/personalInfo.json", function (err, data) {
    data = JSON.parse(data);
    let user = {};
    let is = false;
    if (!err) {
      for (let i in data.users) {
        if (data.users[i].personalInfo.key == key) {
          is = !is;
          user = data.users[i];
        }
      }
      if (!is) {
        res.json({
          ok: 0,
          msg: "用户不存在"
        })
      } else {
        res.json({
          ok: 1,
          msg: "请求成功",
          data: user
        })
      }
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});

//省份投资带排序
router.get('/getProvince', function (req, res, next) {
  let name = ""
  let num = "";
  if (req.query.name) {
    name = req.query.name;
    num = req.query.num / 1;
  }
  let arr = ["totalInvest", "amounts"];
  if (name != 0 && name != 1) {
    name = ""
  }
  fs.readFile("./data/provInvest.json", function (err, data) {
    data = JSON.parse(data);
    if (name != "") {
      if (name == 1) {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], true));
      } else {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], false));
      }

      if (num == -1) {
        data.provinceList = data.provinceList.reverse();
      }
    }

    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        data
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
//区域投资
router.get('/getAreaInvest', function (req, res, next) {
  let areaList = parseInt(req.query.area / 1);

  fs.readFile("./data/areaInvest.json", function (err, data) {
    data = JSON.parse(data);
    if (areaList < 0 || areaList > 7) {
      areaList = 0
    }
    let data1 = {};
    for (let key = 0; key < data.areaList.length; key++) {
      if (data.areaList[key].area == areaList) {
        data1 = data.areaList[key];
      }
    }
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        data: data1
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});

//资金流水
router.get('/getFundflow', function (req, res, next) {
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/fundflow.json", function (err, data) {
    data = JSON.parse(data);
    max = data.provinceList.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    let infoList = data.provinceList.slice(limit, limitEnd)
    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
//资金流水的删除
router.get('/delFundflow', function (req, res, next) {
  let id = req.query.id;
  fs.readFile("./data/fundflow.json", function (err, data) {
    data = JSON.parse(data);
    let is = false;
    let obj = {
      "provinceList": []
    }
    for (let i in data.provinceList) {
      if (data.provinceList[i]._id == id) {
        is = !is;
        obj.provinceList = data.provinceList.splice(i, 1);
      }
    }
    if (!is) {
      res.json({
        ok: 0,
        msg: "id不存在"
      })
    } else {
      fs.writeFile("./data/fundflow.json", JSON.stringify(data), function (err) {
        if (err) {
          res.json({
            ok: -1,
            msg: "删除失败"
          })
        } else {
          res.json({
            ok: 1,
            msg: "删除成功"
          })
        }

      })
    }
  })
});
//资金流水的添加
router.post('/addFundflow', function (req, res, next) {
  let query = req.body;
  fs.readFile("./data/fundflow.json", function (err, data) {
    data = JSON.parse(data);
    let time = new Date().toJSON().split(".")[0].replace(/\-|\:|T/g, '');
    let obj = {
      _id: md5(YL + new Date()),
      "createTime": time,
      "incomePayType": query.incomePayType,
      "incomePayDes": query.incomePayDes,
      "income": query.income,
      "pay": query.pay,
      "accoutCash": query.accoutCash,
      "remarks": query.remarks,
    }
    data.provinceList.push(obj);
    fs.writeFile("./data/fundflow.json", JSON.stringify(data), function (err) {
      if (!err) {
        res.json({
          ok: 1,
          msg: "添加成功",
        })
      } else {
        res.end({
          ok: 0,
          msg: "添加失败"
        })
      }

    })

  })
});
//资金流水的更新
router.post('/upFundflow', function (req, res, next) {
  let query = req.body;
  fs.readFile("./data/fundflow.json", function (err, data) {
    data = JSON.parse(data);
    let id = query._id;
    let is = false;
    for (let i in data.provinceList) {
      if (data.provinceList[i]._id == id) {
        is = !is;
        data.provinceList[i].incomePayType = query.incomePayType
        data.provinceList[i].incomePayDes = query.incomePayDes
        data.provinceList[i].income = query.income
        data.provinceList[i].pay = query.pay
        data.provinceList[i].accoutCash = query.accoutCash
        data.provinceList[i].remarks = query.remarks
      }
    }
    if (!is) {
      res.json({
        ok: -1,
        msg: "未找到"
      })
    } else {
      fs.writeFile("./data/fundflow.json", JSON.stringify(data), function (err) {
        if (!err) {
          res.json({
            ok: 1,
            msg: "修改成功",
          })
        } else {
          res.end({
            ok: 0,
            msg: "修改失败"
          })
        }

      })
    }


  })
});

//资金流水排序
router.get('/getFundflowOrder', function (req, res, next) {
  //排序
  let name = ""
  let num = "";
  if (req.query.name) {
    name = req.query.name;
    num = req.query.num / 1;
  }
  let arr = ["createTime", "income", "pay", "accoutCash"];
  if (parseInt(name) < 0 && parseInt(name) > 3) {
    name = ""
  }


  //分页
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/fundflow.json", function (err, data) {
    let infoList=[];
    data = JSON.parse(data);
    //排序
    if (name != "") {
      if (name == 1) {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], false));
      } else {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], false));
      }

      if (num == -1) {
        data.provinceList = data.provinceList.reverse();
      }
    }
    if (req.query.incomePayType) {
      let incomePayType = req.query.incomePayType; //收支类型
      let arr1 = [];
      for (let index = 0; index < data.provinceList.length; index++) {
        for (let i in data.provinceList) {
          if (data.provinceList[i].incomePayType == incomePayType[index]) {
            arr1.push(data.provinceList[i]);
          }
        }
      }
      if (arr1.length > 0) {
        data.provinceList = arr1;
      }
    }
        infoList = data.provinceList;
    //按照时间筛选
    if (req.query.startTime && req.query.endTime) {
      let startTime = req.query.startTime;
      let endTime = req.query.endTime;
      let arr2 = [];
      for (let i=0;i<infoList.length;i++) {
        if (infoList[i].createTime >= startTime && infoList[i].createTime <= endTime) {
          arr2.push(infoList[i])
        }
      }
      infoList = arr2;
    }
    
    max = infoList.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    infoList = infoList.slice(limit, limitEnd)
    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});

// 支付单据
router.get('/getFundpayment', function (req, res, next) {
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/fundpayment.json", function (err, data) {
    data = JSON.parse(data);
    max = data.provinceList.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    let infoList = data.provinceList.slice(limit, limitEnd)
    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
//支付单据排序
router.get('/getFundpaymentOrder', function (req, res, next) {
  //排序
  let name = ""
  let num = "";
  if (req.query.name) {
    name = req.query.name;
    num = req.query.num / 1;
  }
  let arr = ["payNumber", "orderMoney", "orderTime"];
  if (parseInt(name) < 0 && parseInt(name) > 3) {
    name = ""
  }
  //分页
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/fundpayment.json", function (err, data) {
    data = JSON.parse(data);
    //排序
    if (name != "") {
      if (name == 1) {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], false));
      } else {
        data.provinceList = data.provinceList.sort(compare(arr[name / 1], false));
      }

      if (num == -1) {
        data.provinceList = data.provinceList.reverse();
      }
    }
    if (req.query.payStatus) {
      let payStatus = req.query.payStatus; //支付状态
      let arr1 = [];
      for (let index = 0; index < data.provinceList.length; index++) {
        for (let i in data.provinceList) {
          if (data.provinceList[i].payStatus == payStatus[index]) {
            arr1.push(data.provinceList[i]);
          }
        }
      }
      if (arr1.length > 0) {
        data.provinceList = arr1;
      }
    }
    if (req.query.payType) {
      let payType = req.query.payType; //支付项目
      let arr1 = [];
      for (let index = 0; index < data.provinceList.length; index++) {
        for (let i in data.provinceList) {
          if (data.provinceList[i].payType == payType[index]) {
            arr1.push(data.provinceList[i]);
          }
        }
      }
      if (arr1.length > 0) {
        data.provinceList = arr1;
      }
    }
    let payNumber; //订单查询
    let arrPay = [];
    if (req.query.payNumber) {
      payNumber = req.query.payNumber
      for (let i = 0; i < data.provinceList.length; i++) {
        if (data.provinceList[i].payNumber == payNumber) {
          arrPay.push(data.provinceList[i]);
        }
      }
      data.provinceList = arrPay;
    }
    max = data.provinceList.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > (max - 1)) {
      limitEnd = max
    }
    let infoList = data.provinceList.slice(limit, limitEnd)

    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        max,
        data: infoList
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
//支付单据删除
router.get('/delFundpayment', function (req, res, next) {
  let payNumber = req.query.payNumber;
  fs.readFile("./data/fundpayment.json", function (err, data) {
    data = JSON.parse(data);
    let arr9=[];
    let is =false;
    for (let i = 0; i < data.provinceList.length; i++) {
      if (data.provinceList[i].payNumber != payNumber) {
        arr9.push(data.provinceList[i])
      }else if(data.provinceList[i].payNumber == payNumber) {
        is=!is
      }
    }
    data.provinceList = arr9;
    if (is) {
      res.json({
        ok: 0,
        msg: "id不存在"
      })
    } else {
      fs.writeFile("./data/fundpayment.json", JSON.stringify(data), function (err) {
        if (err) {
          res.json({
            ok: -1,
            msg: "删除失败"
          })
        } else {
          res.json({
            ok: 1,
            msg: "删除成功"
          })
        }

      })
    }
  })
});
//发表文章
router.post('/addFundArticles', function (req, res, next) {
  let query = req.body;
  fs.readFile("./data/FundArticles.json", function (err, data) {
    data = JSON.parse(data);
    let obj = {
      _id: md5(YL + new Date()),
      "title": query.title,
      "abstracts": query.abstracts,
      "author": query.author,
      "category": query.category,
      "comeFrom": query.comeFrom,
      "important": query.important,
      "status": query.status,
      "publishDate": query.publishDate,
      "content": query.content
    }
    // console.log(obj)
    data.data.push(obj);
    fs.writeFile("./data/FundArticles.json", JSON.stringify(data), function (err) {
      if (!err) {
        res.json({
          ok: 1,
          msg: "添加成功",
        })
      } else {
        res.end({
          ok: 0,
          msg: "添加失败"
        })
      }

    })

  })
});
// 删除文章
router.get('/delFundArticles', function (req, res, next) {
  let _id = req.query.id;
  fs.readFile("./data/FundArticles.json", function (err, data) {
    data = JSON.parse(data);
    let obj = {
      "data": []
    }
    let arr9 = [];
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]._id != _id) {
        arr9.push(data.data[i])
      }
    }
    data.data = arr9;
    if (arr9.length <= 0) {
      res.json({
        ok: 0,
        msg: "id不存在"
      })
    } else {
      fs.writeFile("./data/FundArticles.json", JSON.stringify(data), function (err) {
        if (err) {
          res.json({
            ok: -1,
            msg: "删除失败"
          })
        } else {
          res.json({
            ok: 1,
            msg: "删除成功"
          })
        }

      })
    }
  })
});
//编辑文章
router.post('/upFundArticles', function (req, res, next) {
  let query = req.body;
  fs.readFile("./data/FundArticles.json", function (err, data) {
    data = JSON.parse(data);
    let id = query._id;
    let is = false;
    for (let i in data.data) {
      if (data.data[i]._id == id) {
        is = !is;
        data.data[i].status = query.status
      }
    }
    if (!is) {
      res.json({
        ok: -1,
        msg: "未找到"
      })
    } else {
      fs.writeFile("./data/FundArticles.json", JSON.stringify(data), function (err) {
        if (!err) {
          res.json({
            ok: 1,
            msg: "修改成功",
          })
        } else {
          res.end({
            ok: 0,
            msg: "修改失败"
          })
        }

      })
    }


  })
});
//文章的筛选
router.get('/getFundArticlesOrder', function (req, res, next) {
  //排序
  let name = ""
  let num = "";
  if (req.query.name) {
    name = req.query.name;
    num = req.query.num / 1;
  }
  let arr = ["publishDate", " author", " category", "important"];
  if (parseInt(name) < 0 && parseInt(name) > 3) {
    name = ""
  }
  //分页
  let pageIndex; //当前页
  let max; //数据数量
  let liPage = 20; //一页显示数量
  if (req.query.pageIndex) {
    pageIndex = req.query.pageIndex / 1
  } else {
    pageIndex = 1;
  }
  if (req.query.liPage) {
    liPage = req.query.liPage;
  }
  fs.readFile("./data/FundArticles.json", function (err, data) {
    data = JSON.parse(data);
    //排序
    if (name != "") {
      if (name == 1) {
        data.data = data.data.sort(compare(arr[name / 1], false));
      } else {
        data.data = data.data.sort(compare(arr[name / 1], false));
      }

      if (num == -1) {
        data.data = data.data.reverse();
      }
    }
    if (req.query.status) {
      let status = req.query.status; //发布状态
      let arr1 = [];
      for (let index = 0; index < data.data.length; index++) {
        for (let i in data.data) {
          if (data.data[i].status == status[index]) {
            arr1.push(data.data[i]);
          }
        }
      }
      if (arr1.length > 0) {
        data.data = arr1;
      }
    }

    max = data.data.length;
    //边界值判断
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > Math.ceil(max / liPage)) {
      pageIndex = Math.ceil(max / liPage)
    }
    let limit = (pageIndex - 1) * liPage; //开始截取的节点
    let limitEnd = pageIndex * liPage;
    if (limitEnd > max) {
      limitEnd = max
    }
    let infoList = data.data.slice(limit, limitEnd)
    // 返回
    if (!err) {
      res.json({
        ok: 1,
        msg: "请求成功",
        pageIndex,
        max,
        data: infoList
      })
    } else {
      res.end({
        ok: -1,
        msg: "网络错误"
      })
    }
  })
});
// 查看文章
router.get('/findFundArticles', function (req, res, next) {
  
  if (req.query.id) {
    let _id = req.query.id;
    fs.readFile("./data/FundArticles.json", function (err, data) {
      data = JSON.parse(data).data;
      let is = false;
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id == _id) {
          obj = data[i];
          is = !is;
        }
        
      }
      // 返回
     
      if (!err) {
        if (!is) {
          res.json({
            ok: 0,
            msg: "id不存在",
          })
        } else {
          res.json({
            ok: 1,
            msg: "请求成功",
            data: obj
          })
        }

      } else {
        res.json({
          ok: -1,
          msg: "网络错误"
        })
      }
    })
  }else{
    res.json({
      ok: -2,
      msg: "参数错误"
    })
  }
  
});
//排序
function compare(pro, isReplace) {
  return function (obj1, obj2) {
    let val1;
    let val2;
    if (!isReplace) {
      val1 = obj1[pro] / 1;
      val2 = obj2[pro] / 1;
    } else {
      val1 = obj1[pro].replace("+", '').replace("-", '') / 1;
      val2 = obj2[pro].replace("+", '').replace("-", '') / 1;
    }

    if (val1 < val2) { //正序
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  }
}
module.exports = router;