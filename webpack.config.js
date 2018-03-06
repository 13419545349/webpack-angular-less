var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports={
	entry:'./src/js/app.js',
	output:{
		path:__dirname+"/dist",
		filename:'js/main.js',
	},
    module:{
        rules:[
        {
              test:/\.js$/,
              exclude:/node_modules/,
              include:__dirname+/src/,
              loader:"babel-loader",
              options:{
                presets:['env']
              }
        },
        {
              test:/\.html$/,
              loader:"html-loader"
        },
        {
              test:/\.(png|jpg|gif|svg)$/i,
              loader:"file-loader"
        },
        { test:/\.css$/,
            use: [ 
            'style-loader', 
            'css-loader?@importLoaders=1',
        {loader:
            'postcss-loader',
            options:{ 
               plugins:function(){
                return[require('postcss-import')(),
              require('autoprefixer')
          ({ browsers:['last 5 versions'] })
          ]}
      } 
  } 
         ]},
         {
        test: /\.less$/,
        use:
         [ {loader:'style-loader'},
          {loader:
            'css-loader',options:{
                importLoaders:1
            }
        },
           {loader:
                 'postcss-loader',
            options: {
                plugins: function () {
                 return [
                 require('postcss-import')(),
                  require('autoprefixer')];
        }
    }
            },
            {loader:
                   'less-loader'
             }],
           }
      ]
    },

	plugins:[      
        new htmlWebpackPlugin({
            filename:'index.html',      //指定生成的html的文件名，若没设置该项，那么就是index.html
            template:"./src/index.html",
            inject:'body' //设置脚本文件是放在头部还是body
        })
        
    ]
       
}