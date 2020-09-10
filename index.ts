
import * as http from 'http';
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'
const publicPath = p.join(__dirname, 'public')//拼接路径


const server = http.createServer()
let cacheAge = 3600 * 24 * 365

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {

    const { url: path, method, headers } = req
    const { pathname, query } = url.parse(path)
    console.log('pathname')
    console.log(pathname)
    const extname = p.extname(pathname).slice(1)
    const filePath = p.join(publicPath, pathname)
    if (method === 'POST') {
        response(res, { status: 405, extname: 'html', data: '不支持POST' })
        return
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            console.log('捕捉错误')
            if (error.errno === -4058) {
                console.log('文件读取失败')
                fs.readFile(p.join(publicPath, '404.html'), (error, data) => {
                    response(res, { status: 404, extname: 'html', data })
                })
            } else {
                response(res, { status: 500, extname: 'html', data: '服務器内部錯誤' })

            }
            return
        }
        res.setHeader('Cache-Control', `public,max-age=315360000`)
        console.log('xxxx')
        response(res, { status: 200, extname, data: data.toString() })
    })
})

function response(res, { extname, status, data }) {
    res.setHeader('Content-Type', `text/${extname};charset=utf-8`)
    res.statusCode = status
    res.write(data)
    res.end()
}

server.listen(8888);