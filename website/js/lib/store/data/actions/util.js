// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var Promise=require('bluebird')
var validator = new (require('jsonschema').Validator)();
var axios=require('axios')
var _=require('lodash')

exports.api=function(context,name,args){
    return context.dispatch('api/'+name,args,{root:true})
}
exports.parse=function(item,context){
    _.defaults(item,{
        _score:0,
        q:[],
        t:'',
        r:{
            title:"",
            text:"",
            url:""
        },
        select:false
    })
    return item
}

exports.handle=function(reason){
    var self=this
    return function(err){
        console.log("Error:",err)
        self.commit('setError',reason,{root:true})
        return Promise.reject(reason)
    }
}
exports.load=function(list){
    var self=this 
    return Promise.resolve(list)
    .get('qa')
    .each(result=>{ 
        self.commit('addQA',exports.parse(result,self))
        self.commit('page/setTotal',self.state.QAs.length,{root:true})
    })
    .tapCatch(e=>console.log('Error:',e))
    .catchThrow('Failed to load')
}


