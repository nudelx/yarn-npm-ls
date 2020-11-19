# yarn|npm ls 
#### A tiny tool, that can list and run command from your package.json 


<p align="center">
<img style="max-width: 100%; margin-right: auto;  margin-left: auto; " src="https://raw.githubusercontent.com/nudelx/yarn-npm-ls/master/demo.gif" ></p>

<p align="center">
<img style="max-width: 100%; margin-right: auto;  margin-left: auto; " src="https://raw.githubusercontent.com/nudelx/yarn-npm-ls/master/new_demo.gif" ></p>

If you have defined a scripts object in your package, this command will show you the options. 

For example:

```json
{
  "name": "yarn_npm_ls",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "ls": "node node_modules/.bin/ls",
    "test": "Lorem ipsum dolor sit amet",
    "start": "Lorem ipsum dolor sit amet",
    "stop": "Lorem ipsum dolor sit amet",
    "debug": "Lorem ipsum dolor sit amet",
    "deploy": "Lorem ipsum dolor sit amet",
    "release": "Lorem ipsum dolor sit amet",
    "kill": "Lorem ipsum dolor sit amet",
    "restart": "Lorem ipsum dolor sit amet",

  },
  "author": "Alex Nudelman",
  "license": "ISC",
  "dependencies": {
    "chalk": "^3.0.0"
  }
}

```
(yarn or npm) ls
Running this command will execute the ls script that will list all your command defined in the package.json as a scripts.


```bash 
$ yarn ls 


 🤓  Available commands are: 

        1 - start => react-scripts start
   👉  2 - build => react-scripts build
        3 - test => react-scripts test --env=jsdom
        4 - eject => react-scripts eject



 🧐 Use arrows to navigate or type the name/number: 2 or build




```

use the arrow keys to navigate or type the cmd name or the cmd number

---
Custom path if needed: 

 ` ROOT_PATH='/tmp/myproject' yarn ls`

*** for npm you can add it manually by adding this line as a script in the package.json

```javascript
"scripts": {
    "ls": "node_modules/.bin/ls",
    }
```
`npm run ls` will run the script 
