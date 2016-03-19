#!/usr/bin/env node

'use strict'

const
  path     = require('path')
, GH       = require('github')
, ghauth   = require('ghauth')
, minimist = require('minimist')
, exec     = require('child_process').exec
, github   = new GH({
  version: '3.0.0'
, headers: {'User-Agent' : 'create-repo'}
})

var pkg = {}
try {
  pkg = require(path.resolve('package.json'))
} catch(err){
  console.error(err)
}

const argv = minimist(process.argv, {
  string : ['name', 'description']
, alias  : {
    name        : 'n'
  , description : 'd'
  }
, default : {
    name        : pkg.name
  , description : pkg.description
  }
})

exec('git status', (err, stdout, stderr) => {
  if(stderr.indexOf('Not a git repository') > -1){
    console.log('not a git repo! running git init.')
    exec('git init', (err, stdout, stderr) => {
      if(err){
        throw err
      }
      console.log('running git init')
    })
  }

  ghauth({
    configName : 'create-repo'
  , scopes     : ['repo']
  }, (err, auth) => {
    if(err){
      throw err
    }

    github.authenticate({
      type  : 'oauth'
    , token : auth.token
    })

    github.repos.create({
      name        : argv.name
    , description : argv.description
    }, (err, res) => {
      if(err){
        if(err.message[0] !== '{'){
          throw err // not json
        }
        err = JSON.parse(err.message)
        console.error(err.errors[0].message)
        process.exit(1)
      }

      exec('git remote', (err, stdout, stderr) => {
        if(err){
          throw err
        }
        console.log('repo created at https://github.com/' + auth.user + '/' + argv.name)

        if(stdout.indexOf('origin') > -1){
          return
        }

        exec('git remote add origin git@github.com:' + auth.user + '/' + argv.name + '.git', (err, stdout, stderr) => {
          if(err){
            throw err
          }
          console.log('adding origin')

          exec('git add -A && git commit -am "initial commit"', (err, stdout, stderr) => {
            if(err){
              throw err
            }
            console.log('adding all files and making an initial commit')

            exec('git push -u origin master', (err, stdout, stderr) => {
              if(err){
                throw err
              }
              console.log('pushing to remote (with git push -u origin master)')
            })
          })
        })
      })
    })
  })
})

