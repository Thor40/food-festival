const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require('path');
const webpack = require("webpack");

//First, we need to create the main configuration object within our file. 
//We'll write options within this object that tell webpack what to do. 
//As of webpack version 4, a config file is not necessary, 
//but we still want to use one so that we can be more specific with how webpack will function.

module.exports = { 
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    output: {
        filename: "[name].bundle.js", // The name of each attribute in the entry object will be used in place of [name] in each bundle.js file that is created
        path: __dirname + "/dist",
      },
      module: {
          rules: [
              {
                  test: /\.jpg$/i,
                  use: [
                  {
                      loader: 'file-loader',
                      // options object below the loader assignment that contains a name function, which returns the name of the file with the file extension
                      options: {
                          name (file) {
                              return '[path][name].[ext]'
                          },
                          // publicPath changes our assignment URL by replacing the ../ from our require() statement with /assets/.
                        publicPath: function(url) {
                            return url.replace("../", "/assets/")
                        }
                      }
                  },
                  {
                    loader: 'image-webpack-loader'
                  }
                ]
              }
          ]
      },
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new BundleAnalyzerPlugin({
          analyzerMode: "static", // the report outputs to an HTML file in the dist folder (report.html)
      })
  ],
  mode: 'development'
};