# ShowAndTell

## Installation
```
npm install
npm install -g webpack
```
## Run
```
webpack --watch
```
Then in another terminal, run
```
npm start
```

## Deploy
Before you commit, please run `webpack --optimize-minimize` to generate a minified `bundle.js` (Webpack isn't running on the server, so we can't automate this as of now).

Anyway, to deploy to this the server, you need to add it as a remote first.

```sh
git remote add production st@mudhras.org:st.git
```
Then `git push production master` will deploy the latest code.

We use Nginx to as webserver. So, there's a file on the server `/var/nginx/sites-available/st` that has the Nginx configuration. It serves the `public` folder directly. It passes the `/refresh` request to our Node.js app that refreshes the data list.

If you change anything in the Nginx config, you need to reload the config `sudo nginx -s reload`.

This Node.js app is being monitored by [Upstart](http://upstart.ubuntu.com/) which monitors it and keeps it alive. So, there's an `/etc/init/st.conf` which starts this app. All the Environment Variables are also defined there. We have the these variables that need to be defined:

  * ST_URL: The URL where this site is hosted (currently, mudhras.org)
    * ST_IMAGES_PATH: The images location (currently, /home/st/Dropbox/Mudhras)
      * CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET: cloudinary details

      If you change anything in this config, you need to do `sudo restart st` or `sudo start st`.

## Images structure
Images should be there within the `ST_IMAGES_PATH` environment variable that we have set above. Images should be within `images` (lowercase) folder in the `ST_IMAGES_PATH` folder. Then any folder directly within `images` is a Gallery. Any image within those galleries will be shown as pictures. Thumbnails get generated automatically. But for the gallery thumbnail, there needs to be a `gallery_cover.jpg` within the respective folders.
