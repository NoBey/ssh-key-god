#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const program = require('commander');
const colors = require('colors');
const rightpad = require('rightpad');
const userPath = (process.env.HOME || process.env.HOMEPATH) + '/.ssh/known_hosts'
const userConfigPath = (process.env.HOME || process.env.HOMEPATH) + '/.skg.json'
const raw = fs.readFileSync(userPath);
let config = null;
try {
  config =  JSON.parse(fs.readFileSync(userConfigPath)) ;  
} catch (error) {
  config = {};
}
console.log(config)
const version = require('./package.json').version

// program.command('list', '查看全部ssh链接').action(list)
// program.command('go [id] [user]', '发起ssh连接').action(go)
// program.command('del [id]', '删除指定id的链接').action(del)
const alias = {
  'ls': 'list'
}
let cmd = process.argv[1]
if(alias[cmd]) process.argv[1] = alias[cmd]

program.command('list').action(list)
program.command('ls').action(list)
program.command('go [id] [user]').action(go)
program.command('del [id]').action(del)
program.command('set [id] [user]').action(setuset)

// console.log(program)



program
.version(version)
.parse(process.argv);



function list(){
  console.log(`${'=>'.red} ${'The following is a list of SSH links'.cyan}\n`)
  const data = raw.toString().split('\n').filter( a => a!='')
  let length = 0

  data
  .map(a=>a.split(' ')[0])
  .map( a => {
  if(length < a.length){
    length = a.length
  }
    return a
  }).map((a1,i)=>{
    process.stdout.write( rightpad( `   [${i.toString().green}]--${a1.yellow}`, length + 30) )
    if( (i+1)%4 == 0){
      process.stdout.write('\n')
    }
  })
  console.log(`\n\n${'=>'.red} ${'There are'.magenta} ${colors.red(data.length)} ${'SSH links'.magenta}\n`)
  return
}

function setuset(id, user){
  config[id] = user;
  fs.writeFile(userConfigPath, JSON.stringify(config) ,function(...arr){
  })
}

function go(id, user){
  const data = raw.toString().split('\n').filter( a => a!='')
  const item = data[id] || data[config[id]]
  const host = parseIp(item.split(' ')[0])[0]
  console.log(`${'=>'.red} ${'Open'.cyan} ${host.green} ${'Ssh link'.cyan}`)
  if(!user) user = 'root'
  if(config[id] && data[id]) user = config[id]
  if(config[id] && !data[id] && config[config[id]]) user = config[config[id]]
  console.log(item, config[config[id]])
  spawn('ssh',[`${user}@${host}`,'-tt'],{
    stdio: [ process.stdin, process.stdout, process.stderr ]
  })

}

function del(id){
  const data = raw.toString().split('\n').filter( a => a!='')
  const delSsh = data.splice(id,1)
  console.log(`${'=> 正在删除id为 ['.red}${id.toString().green}${'] ...'.red}`)
  save(data)
  console.log(`${'=> '.red + '删除成功'.green}`)
}

function update(id, info){
  const data = raw.toString().split('\n').filter( a => a!='')
  data[id] = info
  console.log(`${'=> 正在修改id为 ['.red}${id.toString().green}${'] ...'.red}`)
  save(data)
  console.log(`${'=> '.red + '修改成功'.green}`)
}

function save(data){
  fs.writeFile(userPath, data.join('\n'),function(...arr){
  })
}

function parseIp(ip){
  if(ip.indexOf(',') == -1){
    return [ip]
  }else{
    return ip.split(',')
  }
}
