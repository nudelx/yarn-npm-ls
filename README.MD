If you have defined a scripts object in your package, this command will run the specified [script]. For example:

yarn run test
Running this command will execute the script named "test" in your package.json.

You can pass additional arguments to your script by passing them after the script name.

yarn run test -o --watch
Running this command will execute jest -o --watch.

[script] can also be any locally installed executable that is inside node_modules/.bin/.
