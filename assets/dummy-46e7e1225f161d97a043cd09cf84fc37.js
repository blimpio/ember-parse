define("dummy/adapters/application",["exports","ember-parse/adapters/parse","dummy/config/environment"],function(e,t,a){"use strict";e["default"]=t["default"].extend({PARSE_APPLICATION_ID:a["default"]["ember-parse"].PARSE_APPLICATION_ID,PARSE_JAVASCRIPT_KEY:a["default"]["ember-parse"].PARSE_JAVASCRIPT_KEY})}),define("dummy/app",["exports","ember","ember/resolver","ember/load-initializers","dummy/config/environment"],function(e,t,a,n,r){"use strict";var d;t["default"].MODEL_FACTORY_INJECTIONS=!0,d=t["default"].Application.extend({modulePrefix:r["default"].modulePrefix,podModulePrefix:r["default"].podModulePrefix,Resolver:a["default"]}),n["default"](d,r["default"].modulePrefix),e["default"]=d}),define("dummy/controllers/application",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({cloud:t["default"].inject.service("cloud"),isAuthenticated:t["default"].computed.alias("session.isAuthenticated"),username:"user@example.com",password:"abc123",loginError:null,cloudCodeResult:null,actions:{createObject:function(){var e=this.store.createRecord("friend",{name:"Juanito"}),t=this.store.createRecord("friend",{name:"Paco"}),a=this.store.createRecord("car",{name:"Toyota"}),n=this.store.createRecord("car",{name:"Honda"}),r=this.store.createRecord("category",{name:"Category"}),d={name:"New",age:2};this.get("session.userId")&&(d.ParseACL={owner:this.get("session.userId")});var l=this.store.createRecord("thing",d);e.save().then(function(){return t.save()}).then(function(){return a.save()}).then(function(){return n.save()}).then(function(){return r.save()}).then(function(){l.get("friends").pushObjects([e,t]),l.get("cars").pushObjects([a]),l.set("category",r),l.save()})},removeFriend:function(e,t){e.get("friends").removeObject(t),e.save()},deleteObject:function(e){e.deleteRecord(),e.save()},updateObject:function(e){e.set("name","Updated"),e.save()},updateCar:function(e){e.set("name",e.get("name")+"*"),e.save()},login:function(){var e=this;this.get("session").authenticate(this.get("username"),this.get("password")).then(function(t){console.log("Logged in:",t.get("email")),e.set("loginError",null),e.send("reloadData")})["catch"](function(t){var a="Code "+t.responseJSON.code+": "+t.responseJSON.error;console.error(a),e.set("loginError",a)})},logout:function(){var e=this;this.get("session").invalidate().then(function(){console.log("Logged out"),e.send("reloadData")})},signup:function(){var e=this;this.get("session").signup({username:this.get("username"),password:this.get("password"),email:this.get("username")}).then(function(t){console.log(t),e.send("login")})["catch"](function(e){var t="Code "+e.code+": "+e.error;console.error(t)})},resetPassword:function(){this.get("session").requestPasswordReset(this.get("username")).then(function(e){console.log(e)})},runCloudCode:function(){var e=this;this.get("cloud").run("sendData",{thing:"car",color:"red"}).then(function(t){t.result.body=JSON.parse(t.result.body),e.set("cloudCodeResult",JSON.stringify(t,null,2))})}}})}),define("dummy/controllers/array",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("dummy/controllers/object",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("dummy/initializers/app-version",["exports","dummy/config/environment","ember"],function(e,t,a){"use strict";var n=a["default"].String.classify,r=!1;e["default"]={name:"App Version",initialize:function(e,d){if(!r){var l=n(d.toString());a["default"].libraries.register(l,t["default"].APP.version),r=!0}}}}),define("dummy/initializers/export-application-global",["exports","ember","dummy/config/environment"],function(e,t,a){"use strict";function n(e,n){var r=t["default"].String.classify(a["default"].modulePrefix);a["default"].exportApplicationGlobal&&!window[r]&&(window[r]=n)}e.initialize=n,e["default"]={name:"export-application-global",initialize:n}}),define("dummy/initializers/parse",["exports","ember-parse/initializers/parse"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/models/car",["exports","ember-data"],function(e,t){"use strict";e["default"]=t["default"].Model.extend({name:t["default"].attr("string"),things:t["default"].hasMany("thing",{async:!0})})}),define("dummy/models/category",["exports","ember-data"],function(e,t){"use strict";e["default"]=t["default"].Model.extend({name:t["default"].attr("string")})}),define("dummy/models/friend",["exports","ember-data"],function(e,t){"use strict";e["default"]=t["default"].Model.extend({name:t["default"].attr("string"),things:t["default"].hasMany("thing",{async:!0})})}),define("dummy/models/thing",["exports","ember-data"],function(e,t){"use strict";e["default"]=t["default"].Model.extend({name:t["default"].attr("string"),age:t["default"].attr("number"),createdAt:t["default"].attr("date"),category:t["default"].belongsTo("category",{async:!0}),friends:t["default"].hasMany("friend",{async:!0}),cars:t["default"].hasMany("car",{async:!0})})}),define("dummy/models/user",["exports","ember-parse/models/parse-user"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/router",["exports","ember","dummy/config/environment"],function(e,t,a){"use strict";var n=t["default"].Router.extend({location:a["default"].locationType});n.map(function(){}),e["default"]=n}),define("dummy/routes/application",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Route.extend({model:function(){return this.store.findAll("thing")},actions:{reloadData:function(){this.store.unloadAll("car"),this.store.unloadAll("category"),this.store.unloadAll("friend"),this.store.unloadAll("thing"),this.store.unloadAll("user"),this.refresh()}}})}),define("dummy/serializers/application",["exports","ember-parse/serializers/parse"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/services/cloud",["exports","ember-parse/services/cloud"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/templates/application",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:3,column:0},end:{line:10,column:0}},moduleName:"dummy/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("  ");e.appendChild(t,a);var a=e.createElement("a");e.setAttribute(a,"href","#");var n=e.createTextNode("Logout");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n  ");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createTextNode("\n  ");e.appendChild(t,a);var a=e.createElement("form"),n=e.createTextNode("\n    ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createTextNode("\n    ");e.appendChild(a,n);var n=e.createElement("button");e.setAttribute(n,"type","submit");var r=e.createTextNode("Reset password");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n  ");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[1]),r=e.childAt(t,[7]),d=new Array(3);return d[0]=e.createElementMorph(n),d[1]=e.createElementMorph(r),d[2]=e.createMorphAt(r,1,1),d},statements:[["element","action",["logout"],[]],["element","action",["resetPassword"],["on","submit"]],["inline","input",[],["type","text","value",["subexpr","@mut",[["get","username"]],[]],"placeholder","email"]]],locals:[],templates:[]}}(),t=function(){var e=function(){return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:11,column:2},end:{line:15,column:2}},moduleName:"dummy/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    ");e.appendChild(t,a);var a=e.createElement("p"),n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createTextNode("\n    ");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=new Array(1);return n[0]=e.createMorphAt(e.childAt(t,[1]),1,1),n},statements:[["content","loginError"]],locals:[],templates:[]}}();return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:10,column:0},end:{line:23,column:0}},moduleName:"dummy/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n  ");e.appendChild(t,a);var a=e.createElement("form"),n=e.createTextNode("\n    ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createElement("br");e.appendChild(a,n);var n=e.createTextNode("\n    ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createElement("br");e.appendChild(a,n);var n=e.createTextNode("\n    ");e.appendChild(a,n);var n=e.createElement("button");e.setAttribute(n,"type","submit");var r=e.createTextNode("Login");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n  ");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n  ");e.appendChild(t,a);var a=e.createElement("button"),n=e.createTextNode("Sign up");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[2]),r=e.childAt(t,[4]),d=new Array(5);return d[0]=e.createMorphAt(t,0,0,a),d[1]=e.createElementMorph(n),d[2]=e.createMorphAt(n,1,1),d[3]=e.createMorphAt(n,4,4),d[4]=e.createElementMorph(r),e.insertBoundary(t,0),d},statements:[["block","if",[["get","loginError"]],[],0,null],["element","action",["login"],["on","submit"]],["inline","input",[],["type","text","value",["subexpr","@mut",[["get","username"]],[]],"placeholder","username"]],["inline","input",[],["type","text","value",["subexpr","@mut",[["get","password"]],[]],"placeholder","password"]],["element","action",["signup"],[]]],locals:[],templates:[e]}}(),a=function(){var e=function(){return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:44,column:8},end:{line:46,column:8}},moduleName:"dummy/templates/application.hbs"},arity:1,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("          ");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode(" ");e.appendChild(t,a);var a=e.createElement("a");e.setAttribute(a,"href","#");var n=e.createTextNode("X");e.appendChild(a,n),e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[3]),r=new Array(2);return r[0]=e.createMorphAt(t,1,1,a),r[1]=e.createElementMorph(n),r},statements:[["content","friend.name"],["element","action",["removeFriend",["get","thing"],["get","friend"]],[]]],locals:["friend"],templates:[]}}(),t=function(){return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:49,column:8},end:{line:51,column:8}},moduleName:"dummy/templates/application.hbs"},arity:1,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("          ");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode(" ");e.appendChild(t,a);var a=e.createElement("a");e.setAttribute(a,"href","#");var n=e.createTextNode("*");e.appendChild(a,n),e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[3]),r=new Array(2);return r[0]=e.createMorphAt(t,1,1,a),r[1]=e.createElementMorph(n),r},statements:[["content","car.name"],["element","action",["updateCar",["get","car"]],[]]],locals:["car"],templates:[]}}();return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:38,column:2},end:{line:58,column:2}},moduleName:"dummy/templates/application.hbs"},arity:1,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createTextNode("    ");e.appendChild(t,a);var a=e.createElement("tr"),n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createComment("");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createComment("");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createComment("");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createTextNode("\n");e.appendChild(n,r);var r=e.createComment("");e.appendChild(n,r);var r=e.createTextNode("      ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createTextNode("\n");e.appendChild(n,r);var r=e.createComment("");e.appendChild(n,r);var r=e.createTextNode("      ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n      ");e.appendChild(a,n);var n=e.createElement("td"),r=e.createTextNode("\n        ");e.appendChild(n,r);var r=e.createElement("a");e.setAttribute(r,"href","#"),e.setAttribute(r,"style","color:red");var d=e.createTextNode("Delete");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n        ");e.appendChild(n,r);var r=e.createElement("a");e.setAttribute(r,"href","#");var d=e.createTextNode("Update");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n      ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n    ");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[1]),r=e.childAt(n,[11]),d=e.childAt(r,[1]),l=e.childAt(r,[3]),i=new Array(7);return i[0]=e.createMorphAt(e.childAt(n,[1]),0,0),i[1]=e.createMorphAt(e.childAt(n,[3]),0,0),i[2]=e.createMorphAt(e.childAt(n,[5]),0,0),i[3]=e.createMorphAt(e.childAt(n,[7]),1,1),i[4]=e.createMorphAt(e.childAt(n,[9]),1,1),i[5]=e.createElementMorph(d),i[6]=e.createElementMorph(l),i},statements:[["content","thing.id"],["content","thing.name"],["content","thing.category.name"],["block","each",[["get","thing.friends"]],[],0,null],["block","each",[["get","thing.cars"]],[],1,null],["element","action",["deleteObject",["get","thing"]],[]],["element","action",["updateObject",["get","thing"]],[]]],locals:["thing"],templates:[e,t]}}();return{meta:{revision:"Ember@1.13.2",loc:{source:null,start:{line:1,column:0},end:{line:66,column:0}},moduleName:"dummy/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createElement("h2");e.setAttribute(a,"id","title");var n=e.createTextNode("Ember Parse");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createComment("");e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createElement("a");e.setAttribute(a,"href","#");var n=e.createTextNode("Create Object");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createElement("table"),n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createElement("tr"),r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("ID");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("Name");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("Category");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("Friends");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("Cars");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("th"),d=e.createTextNode("Actions");e.appendChild(r,d),e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createTextNode("  ");e.appendChild(a,n);var n=e.createElement("tr"),r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("td");e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createElement("br");e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createElement("button"),n=e.createTextNode("Run Cloud Code");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");e.appendChild(t,a);var a=e.createElement("pre"),n=e.createComment("");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=e.childAt(t,[8]),r=e.childAt(t,[14]),d=new Array(5);return d[0]=e.createMorphAt(t,2,2,a),d[1]=e.createElementMorph(n),d[2]=e.createMorphAt(e.childAt(t,[10]),3,3),d[3]=e.createElementMorph(r),d[4]=e.createMorphAt(e.childAt(t,[16]),0,0),d},statements:[["block","if",[["get","isAuthenticated"]],[],0,1],["element","action",["createObject"],[]],["block","each",[["get","model"]],[],2,null],["element","action",["runCloudCode"],[]],["content","cloudCodeResult"]],locals:[],templates:[e,t,a]}}())}),define("dummy/config/environment",["ember"],function(e){var t="dummy";try{var a=t+"/config/environment",n=e["default"].$('meta[name="'+a+'"]').attr("content"),r=JSON.parse(unescape(n));return{"default":r}}catch(d){throw new Error('Could not read config from meta tag with name "'+a+'".')}}),runningTests?require("dummy/tests/test-helper"):require("dummy/app")["default"].create({name:"ember-parse",version:"0.0.5-alpha"});