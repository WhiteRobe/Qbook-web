import Vue from 'vue';
import VeeValidate,{ Validator } from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN';

const config = {
    errorBagName: 'veeErrors', // change if property conflicts.
    fieldsBagName: 'veeFields',
};
Vue.use(VeeValidate, config);

import axios from 'axios';
import {Store} from './store.js';

// 部署中文
Validator.localize('ar', {
    messages: zh_CN.messages,
    attributes: {
        idinput: '用户名'
    }
  });

// 异步校用户名是否重复 BEGIN
Validator.extend('idAjax',{
    getMessage: field => '您的用户名已被占用',
    validate: value => {
        return axios.get(Store.state.server+"/UserNameAJAXServlet", 
            {
                params: { // get 模式手动赋值
                    "jsondata": {"ID":value}
                }
            })
            .then(function (response) {
                let res = response.data;
                return res.FLAG;
            });
    }
},{immediate: false});
// 异步校用户名是否重复 END

// 异步校验验证码是否正确 BEGIN
Validator.extend('vcAjax',{
    getMessage: field => '您的验证码[' + field + ' ]填写错误',
    validate: value => {
            //console.log(value);
            if(!(/^[a-zA-Z0-9]{4,4}$/.test(value))) return false;
            //var valided = true;
            return axios.get(Store.state.server+"/ValiAJAXServlet", 
                {
                    params: { // get 模式手动赋值
                        "jsondata": {"VC":value}
                    }
                })
                .then(function (response) {
                    let res = response.data;
                    //valided = res.FLAG;
                    //console.log(res.MSG,valided);
                    return res.FLAG;
                });
                // .catch(function (error) {
                // 	console.log(error);
                // });
                // return new Promise(resolve => {
                // 	resolve({
                // 		valid: valided,
                // 		data: valided ? undefined : { message: '验证码错误' }
                // 	});
                // });
        }
},{immediate: false});
// 异步校验验证码是否正确 END