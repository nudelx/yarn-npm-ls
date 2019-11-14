# yarn|npm ls



If you have defined a scripts object in your package, this command will show you the options. 

For example:

```json
{
  "name": "yarn_npm_ls",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
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
Running this command will execute the script named "ls.js" that will list all your command defined in  the package.json as a scripts.


```bash 
👉  Available commands are:

✷ - test
✷ - start
✷ - stop
✷ - debug
✷ - deploy
✷ - release
✷ - kill
✷ - restart
```