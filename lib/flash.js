/**
 * Module dependencies.
 * 用到 node 本身的 module 
 * 
 * 這個註解的方式是用 JS Docs，可以看一下
 */
var format = require('util').format;  // format 是可以用像 preparestatement 那個概念去產生字串的 method，PHP 有一個很像的東西忘了叫啥
var isArray = require('util').isArray; // 應該就是字面上的檢查是不是 array 吧


/**
 * 這段不知道是啥？應該是跟 auto fill 有關係的吧？
 * Expose `flash()` function on requests.
 *
 * @return {Function}
 * @api public
 * 
 */


/*
  想一下說我們平常是怎麼用這個的。啟用適用 res.use(flssh())
  他就用閉包儲存一些選項這樣
  
*/
module.exports = function flash(options) {
  options = options || {};
  var safe = (options.unsafe === undefined) ? true : !options.unsafe;
  
  return function(req, res, next) {
    if (req.flash && safe) { return next(); }
    req.flash = _flash;
    next();
  }
}

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 
 && 這裡就是用 format() 的原因了
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass variable arguments to `req.flash()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.flash('info', 'email has been sent to %s.', userName);
 *
 * Formatting uses `util.format()`, which is available on Node 0.6+.
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function _flash(type, msg) {
  if (this.session === undefined) throw Error('req.flash() requires sessions');
  var msgs = this.session.flash = this.session.flash || {};
  if (type && msg) {
    // util.format is available in Node.js 0.6+
    if (arguments.length > 2 && format) {
      var args = Array.prototype.slice.call(arguments, 1);
      msg = format.apply(undefined, args);
    } else if (isArray(msg)) {
      msg.forEach(function(val){
        (msgs[type] = msgs[type] || []).push(val);
      });
      return msgs[type].length;
    }
    return (msgs[type] = msgs[type] || []).push(msg);
  } else if (type) {
    var arr = msgs[type];
    delete msgs[type];
    return arr || [];
  } else {
    this.session.flash = {};
    return msgs;
  }
}
