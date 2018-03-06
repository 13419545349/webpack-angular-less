import "../css/index.less";
import "./angular.min.js";

angular.module("myApp",['ui.router','validation'])
    /*.service('cache',['$cookies',function($cookies){
        this.put = function(key,value){};
        this.get = function(key){
        	return $cookies.get(key);
        };
        this.remove = function(key){
        	return $cookies.remove(key);
        }
    }])
     .factory('cache',['$cookies',function($cookies){
     	return {
     		get:function(key,value){
                $cookies.get(key)
     		},
     		put:function(key,value){
                $cookies.put(key,value)
     		}
     	}
     }])*/ //使用时候也是使用cache.put()
    .config(['$validationProvider',function($validationProvider){
      var expression = {
           phone:/^1[\d]{10}$/,
           password: function(value){
            var str = value + '';
            return str.length>5;
           },
           required:function(value){
            return !!value;
           }
      };
      var defaultMsg = {
           phone:{
            success:'',
            error:'必须是11手机号'
           },
           password:{
            success:'',
            error:'长度至少为6位'
           },
           required:{
            success:'',
            error:'不能为空'
           }
      };
      $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    }])
    .config(['$provide',function($provide){
      $provide.decorator('$http',['$delegate','$q',function($delegate,$q){
            var get = $delegate.get;
            $delegate.post = function(url,data,config){
              var def =$q.defer();
              get(url).success(function(resp){
                   def.resolve(resp);
              }).error(function(err){
                   def.reject(err)
              })
              return {
                success:function(cb){
                  def.promise.then(cb)
                },
                error:function(cb){
                  def.promise.then(null,cb);
                }
              }

            }
            return $delegate;
      }])
    }])


    .config(['$stateProvider','$urlRouterProvider',
	    function($stateProvider,$urlRouterProvider){
		$stateProvider.state('main',{
			url:'/main',
			templateUrl:"src/view/main.html",
			controller:"mainCtrl"				
				})
		.state('position',{
			url:'/position/:id',
			templateUrl:"src/view/position.html",
			controller:'positionCtrl'
		})
		.state('company',{
			url:"/company/:id",
			templateUrl:"src/view/company.html",
			controller:"companyCtrl"
		})
		.state('search',{
			url:"/search",
			templateUrl:"src/view/search.html",
			controller:"searchCtrl"
		})
    .state('login',{
      url:"/login",
      templateUrl:"src/view/login.html",
      controller:"loginCtrl"
    })
    .state('regist',{
      url:"/regist",
      templateUrl:"src/view/regist.html",
      controller:"registCtrl"
    })
    .state('me',{
      url:"/me",
      templateUrl:"src/view/me.html",
      controller:"meCtrl"
    })
    .state('post',{
      url:"/post",
      templateUrl:"src/view/post.html",
      controller:"postCtrl"
    })
    .state('favorite',{
      url:"/favorite",
      templateUrl:"src/view/favorite.html",
      controller:"favoriteCtrl"
    })
		 $urlRouterProvider.otherwise('main')             
	}])
	.run(['$rootScope',function($rootScope){
       // 用处即定义公共的函数与变量 此处定义了一个公共的函数
       $rootScope.msg=function(){
        	console.log('msg')
        };
        $rootScope.chaochao = "chaochao";
	}])

	//value定义一个全局的变量
	.value('dict',{}).run(['dict','$http',function(dict,$http){
		$http.get('src/data/city.json').success(function(resp){
			dict.city = resp;
		});
		$http.get('src/data/salary.json').success(function(resp){
			dict.salary = resp;			
		});
		$http.get('src/data/scale.json').success(function(resp){
			dict.scale = resp;
		});
	}])
	

	//控制器
    .controller("mainCtrl",["$http","$scope",function($http,$scope){
    	$http.get('src/data/positionList.json').success(function(res){
    		console.log(res);
    		$scope.list=res;
    		console.log($scope.$root);
    		$scope.msg();
    		console.log($scope.chaochao)
    	});
  	      /*$scope.list=[{
  	      	id:'1',
  	      	imgSrc:'/image/company-3.png',
  	      	name:'销售',
  	      	companyName:'千度',
  	      	city:'上海',
  	      	industry:'互联网',
  	      	time:'2017-09-11 11:05'
  	      },
  	      {
  	      	id:'2',
  	      	imgSrc:'/image/company-1.png',
  	      	name:'销售',
  	      	companyName:'慕课网',
  	      	city:'北京',
  	      	industry:'互联网',
  	      	time:'2017-09-11 16:16'
  	      },
  	       {
  	      	id:'3',
  	      	imgSrc:'/image/company-1.png',
  	      	name:'技术',
  	      	companyName:'慕课网',
  	      	city:'武汉',
  	      	industry:'互联网',
  	      	time:'2017-08-11 16:16'
  	      },
  	       {
  	      	id:'4',
  	      	imgSrc:'/image/company-1.png',
  	      	name:'销售',
  	      	companyName:'慕课网',
  	      	city:'监利',
  	      	industry:'互联网',
  	      	time:'2017-09-11 16:16'
  	      },
  	      
  	       {
  	      	id:'6',
  	      	imgSrc:'/image/company-1.png',
  	      	name:'销售',
  	      	companyName:'慕课网',
  	      	city:'荆州',
  	      	industry:'互联网',
  	      	time:'2017-09-11 16:16'
  	      }]*/
     }])
    .controller('positionCtrl',['$q','$http','$timeout','$state','$scope',function($q,$http,$timeout,$state,$scope){
    	   //cache.put('to','day');
    	   $scope.isLogin = false;
    	  // cache.put('to','day' );
          // $http.get('src/data/position.json?id='+$state.params.id).success(function(res){
           	  //$scope.position = res;
           	  function getPosition(){
           	  	var def=$q.defer();
           	  	$http.get('src/data/position.json?id='+$state.params.id)
           	  	//也可以这样写$http.get('src/data/position.json',{params:id:$state.params.id})
           	  	.success(function(res){
           	  	$scope.position = res;
           	  	 def.resolve(res);
           	  	// console.log(def.resolve);
           	  }).error(function(err){
           	  	def.reject("失败");
           	  	//console.log(def.reject)
           	  })
           	  	return def.promise;            
           }
           function getCompany(id){
           	$http.get('src/data/company.json?id='+id).success(function(res){
           		$scope.company = res;
           	})
           }
           getPosition().then(function(obj){
           	  getCompany(obj.companyId);
           })
           //$timeout(function(){
           //	alert("好好学习")
          // },3000)
          // $q.all([fun1(),fun2()]).then(function(result){});
           	  
    }])
    .controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
           $http.get('src/data/company.json?id='+$state.params.id).success(function(res){
           	$scope.company = res;
           	$scope.$broadcast('abc',"这是要传播的事件");
           
           });
           	$scope.$on('www',function(event,data){
           	console.log(data)
           })
          
    }])
    .controller('searchCtrl',['dict','$http','$scope',function(dict,$http,$scope){             
               $scope.name="";
              
               $scope.search = function(){
                  $http.get('src/data/positionList.json?name='+$scope.name).success(function(res){
                  $scope.positionList = res
               });  
               };
               $scope.search();
               $scope.sheet = {};
               $scope.tabList = [{
               	  id:'city',
               	  name:'城市',
               },{
               	   id:'salary',
               	   name:'薪水',
               },{
               	   id:'scale',
               	   name:'公司规模'
               }];
                $scope.filterObj = {};
                var tabId ='';
               $scope.tClick=function(id,name){
               	tabId = id ;
               	$scope.sheet.list = dict[id];
               	$scope.sheet.visible = true;
               };
               $scope.sClick = function(id,name){
               	 if(id){
                      angular.forEach($scope.tabList ,function(item){
                        if(item.id === tabId){
                        	item.name = name;
                        	//console.log(123);
                        }
                      });
                      $scope.filterObj[tabId + 'Id'] = id; 
                      console.log($scope.filterObj[tabId + 'Id'])
               	 }else{
               	 	   delete $scope.filterObj[tabId + 'Id'];
                       angular.forEach($scope.tabList,function(item){
                       	if(item.id===tabId){
                       		switch(item.id){
                       			case 'city':
                       			  item.name = '城市';
                       			break;
                       			case 'salary':
                       			   item.name = '薪水';
                       			break;
                       			case 'scale':
                       			   item.name = "公司规模";
                       			break;
                       			default:

                       		}
                       	}
                       })

               	 }
               }
    }])
    .controller('loginCtrl',['$http','$state','$scope',function($http,$state,$scope){
          $scope.submit = function(){  
            $http.post('src/data/login.json',$scope.user).success(function(resp){
              $state.go('main');
            })
          }
    }])
    .controller('registCtrl',['$interval','$http','$state','$scope',function($interval,$http,$state,$scope){
          $scope.submit = function(){    

            $http.post('src/data/regist.json',$scope.user).success(function(resp){
                       //console.log(resp)
                       $state.go('login');
            })
          }
          var count = 60;
          $scope.send = function(){
            $http.get('src/data/code.json').success(function(res){
              if(res.state == 1){
                count = 60;
                $scope.time='60s';
                  var interval=$interval(function(){
                    if(count<=0){
                      $interval.cancel(interval);
                      $scope.time="";
                    }else{
                      count--;
                      $scope.time = count +'s';
                    }                      
                  },1000)
              }
            })
          }
    }])
    .controller('meCtrl',['$state','$scope',function($state,$scope){
          $scope.logout = function(){
            $state.go('main')
          }
    }])
    .controller('postCtrl',['$http','$scope',function($http,$scope){
          $scope.tabList = [{
            id:"all",
            name:"全部",
          },{
            id:"pass",
            name:"面试邀请",
          },{
            id:"fail",
            name:"不合格"
          }];
          $http.get('src/data/myPost.json').success(function(res){
            $scope.positionList = res;
          })
          $scope.filterObj = {};
          $scope.tClick = function(id,name){
            switch (id){
              case 'all':
              delete $scope.filterObj.state;
              break;
              case 'pass':
                $scope.filterObj.state = "1";
              break;
              case 'fail':
                $scope.filterObj.state = "-1";
              break;
              default:
            }
          }
    }])
    .controller('favoriteCtrl',['$http','$scope',function($http,$scope){
          $http.get('src/data/myFavorite.json').success(function(resp){
            $scope.list = resp;
          })
    }])
 
   
    //指令
    .directive("appHead",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	templateUrl:"src/view/template/head.html"
	 }
     })
    .directive("appFoot",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	templateUrl:"src/view/template/foot.html"
	 }
     })
     .directive("appPositionList",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	transclude:true,
	 	templateUrl:"src/view/template/positionlist.html",
	 	scope:{
	 		shuju:"=",
	 		filterObj:"="
	 	}

	 }
     })
      .directive("appHeadBar",[function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	transclude:true,
	 	templateUrl:"src/view/template/headBar.html",
	 	scope:{
	 		text:'@'
	 	},
	 	link:function($scope){
	 		$scope.back=function(){
	 			window.history.back();
	 		};
	 		$scope.$on('abc',function(event,res){
	 			console.log(event,res)
	 		})
	 		$scope.$emit('www',"这是向上广播的数据")
	 	}
	 }
     }])
       .directive("appPositionInfo",[function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	templateUrl:"src/view/template/positioninfo.html",
	 	scope:{
            isActive:"=",
            isLogin:"=",
            pos:"="
	 	},
	 	link:function(scope){
           scope.imagePath = scope.isActive?'src/iamge/star-active.png':'src/image/star.png'
	 	}
	 }
     }])
        .directive("appCompany",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	transclude:true,
	 	templateUrl:"src/view/template/company.html",
	 	scope:{
	 		com:"="
	 	}
	 }
     })
        .directive("appPositionClass",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	transclude:true,
	 	templateUrl:"src/view/template/appPositionClass.html",
	 	scope:{
	 		com:'='
	 	},
	 	link:function($scope){
	 		
	 		$scope.showPositionList=function(idx){
               $scope.positionList = $scope.com.positionClass[idx].positionList;
               $scope.isActive = idx;
	 		} 
	 		$scope.$watch('com',function(newVal,oldVal){
	 			if(newVal){
	 				console.log(newVal)
	 				$scope.showPositionList(0);  
	 			}
	 		})
	 		     
	 	}
	 }
     })
        .directive("appTab",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	transclude:true,
	 	scope:{
	 		list:'=',
	 		tabClick:'&'
	 	},
	 	templateUrl:"src/view/template/appTab.html",
	 	link:function($scope){
          $scope.click = function(tab){
          	$scope.selectId = tab.id;
          	$scope.tabClick(tab);
          }
	 	}
	  }	 	
     })
    .directive("appSheet",function(){
	 return{
	 	restrict:"AEMC",
	 	replace:true,
	 	scope:{
           list:'=',
           visible:'=',
           select:'&'
	 	},
	 	templateUrl:"src/view/template/appSheet.html"
	 }
     })


    //过滤器
    .filter('filterByObj',[function(){
    	return function(list,obj){
    		var result = [];
    		angular.forEach(list,function(item){
    			var isEqual = true;
    			for(var e in obj){
                   if(item[e]!==obj[e]){
                   	 isEqual = false;
                   }
    			}
    			if(isEqual){
                   result.push(item);
    			}
    		});
    		return result;
    	}
    }])



 