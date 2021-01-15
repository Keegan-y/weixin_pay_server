let config = require('./../pay/config')
let request = require('request')
let util = require('../../util/util')
let createHash = require('create-hash')
let xml = require('xml2js')
// let name = require(参数1)
config = config.mch;
module.exports = {
    order: function(appid,attach, body, openid, total_fee, notify_url, ip){
        return new Promise((resolve,reject)=>{
            let nonce_str = util.createNonceStr();
            let out_rade_no = util.getTradeId('mp');
            let sign = this.getPrePaySign(appid,attach,body,openid,total_fee,notify_url,ip,nonce_str,out_rade_no)
            let sendData = this.wxSendData(appid,attach,body,
                openid,total_fee,notify_url,ip,nonce_str,out_trade_no,sign);
            let self = this;
            let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
            request({
                url,
                method:'POST',
                body:sendData
            },function(err,response,body){
                if (!err && response.statusCode == 200){
                    xml.parseString(body.toString('utf-8'),(error,res)=>{
                        if(!error){
                            let data = res.xml;
                            console.log("data:" + JSON.stringify(data));
                            if (data.return_code[0] == "SUCCESS" && data.result_code[0]
                             == "SUCCESS"){
                                 let prepay_id = data.prepay_id || [];
                                 let payResult = self.getPayParams(appid,prepay_id[0]);
                                 resolve(payResult);
                             }
                        }
                    })
                } else {
                    resolve(util.handleFail(err));
                }
            })
        })
    },
    getPrePaySign: function(appid,attach,body,openid,total_fee,notify_url,ip,
         nonce_str, out_trade_no){
             let params = {
                 appid,
                 attach,
                 body,
                 mch_id:config.mch_id,
                 nonce_str,
                 notify_url,
                 openid,
                 out_trade_no,
                 spbill_create_ip:ip,
                 total_fee,
                 trade_type:"JSAPI"
             }//jjj
         }
        
}