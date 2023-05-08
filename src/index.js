
import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import bodyParser from 'body-parser';

const API_KEY = ''; // 替换为您的 OpenAI API 密钥


/***
*
* 代理地址 ！！！！！！源码配置只适用于 本地计算机IP （就是你本地电脑科学上网的IP）
*。国内的服务器部署 需要换成自己的服务器 nginx IP ,
*。如果是国外服务器 部署 则不需要该配置， 
*/
const proxy = 'http://127.0.0.1:7890'; 
const openAIurl = "https://api.openai.com/v1/chat/completions"; //openAi 地址
const diyServeUrl = "/api/openai/gpt3"; //服务器地址
const agent = new HttpsProxyAgent(proxy); // 创建代理，本地请求测试需要进行科学上网必须开启（前提条件），
// 部署线上需要用到 "外面的服务器" (这里不做过多解释 懂得都懂)

const app = express();
app.use(cors())//跨域需求 为了方便本地请求，如果部署线上 需要禁止他（地址不泄漏情况☺️可以不管）
app.use(bodyParser.json());
// 设置路由，用于接收前端请求
// ada: 一个强大的文本生成引擎，可生成各种类型的文本，包括长篇文章、故事、诗歌和对话。
// babbage: 一个文本生成引擎，可以生成文章、电子邮件和简短的聊天对话。
// curie: 一个文本生成引擎，可以生成短的文本片段，例如电子邮件、新闻文章和散文。
// davinci: OpenAI最强大的文本生成引擎，可以生成各种类型的文本，包括长篇文章、故事、诗歌和对话。
// curie: 一个文本生成引擎，可以生成短的文本片段，例如电子邮件、新闻文章和散文。
// davinci-codex: 用于对代码的生成和补全的引擎。
// davinci-instruct-beta: 可以解释和生成自然语言指令的引擎。
// const url = "https://api.openai.com/v1/engines/davinci-codex/completions";
app.post(diyServeUrl, async (req, res) => {
    try {
        const response = await fetch(openAIurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(req.body),
            agent: agent // 设置代理 如果是国外服务器则不需要改配置 必须删掉， 
        });
        // 解析响应数据为 JSON 格式
        const responseData = await response.json();
        res.json(responseData);
    } catch (error) {
        console.error(error);
    }
});

// 启动服务器，监听端口
app.listen(3000, () => {
    console.log('代理服务器已启动，监听端口 3000');
});

