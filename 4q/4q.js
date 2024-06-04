// ----------------------------------------------------------------------
// Global settings
// ----------------------------------------------------------------------

var DEFAULT_Q = 'A'; // 座標可以忽略象限，但此時必須是數字。可以是單位數。
                     // 對死活題尤其有用，並可以選擇棋盤取向，如此設定：
                     //   #!set DEFAULT_Q = C
// Coordinates may omit the quandrant prefix, where it must be numeric then.
// This is particularly useful for, say, life-and-death problems.
// It allows the choice of the board orientation with this directive:
//   #!set DEFAULT_Q = C


// ----------------------------------------------------------------------
// Interface
// ----------------------------------------------------------------------

class FourQPosRepo {
  from4Q(name) { return this[name]; }
  fromXY(x,y) { return this[x + '_' + y]; }
  fromSgfXY(xy) { return this['sgf_'+xy]; }

  add(pos) {
    if (!POS_REPO[pos.name]) {
      POS_REPO[pos.name] = pos;
      POS_REPO['sgf_' + pos.sgfXY()] = pos;
    }
    var name = pos.x + '_' + pos.y;
    if (!POS_REPO[name])
      POS_REPO[name] = pos;
  }
}
var POS_REPO = new FourQPosRepo();

function toNumericPosName(x, y) { // x,y: absolutye coords, 1-based
  var ret = 'Error';
  if (x == 10) {
    if (y == 10) ret = 'O';
    if (y < 10)  ret = 'S' + y;
                 ret = 'N' + (20-y);
  }
  else if (y == 10) {
    if (x < 10)  ret = 'W' + x;
    else         ret = 'E' + (20-x);
  }
  else if (x < 10) {
    if (y < 10)  ret = 'A' + x + '' + y;
    else         ret = 'B' + x + '' + (20-y);
  }
  else {
    if (y < 10)  ret = 'D' + (20-x) + '' + y;
    else         ret = 'C' + (20-x) + '' + (20-y);
  }
  switch(ret) {
  case 'A44': case 'B44': case 'C44': case 'D44':
  case 'E4':  case 'W4':  case 'S4':  case 'N4':
           return ret[0];
  default: return (ret[1] == ret[2]) ? ret.substring(0,2) : ret;
  }
}

class FourQPosErr {
  constructor(msg) {
    this.name = 'Error';
    this.errMsg = msg;
  }
  isError() { return true; }
}

class FourQPos {
  // added to POS_REPO appropriately.
  constructor(name, x, y) { // (x,y): absolute numeric coordinates, from LL corner; 1-based.
    this.name = name;
    this.numericName = toNumericPosName(x, y);
    this.x = (typeof x === 'string') ? parseInt(x) : x;
    this.y = (typeof y === 'string') ? parseInt(y) : y;
    POS_REPO.add(this);

    var len = arguments.length;
    if (len > 3) {
      this.nicknames = [];
      for (var i=3; i<len; ++i) {
        var nn = arguments[i];
        this.nicknames.push(nn);
        !POS_REPO[nn] && (POS_REPO[nn] = this);
      }
    }
  }

  isError() { return this.name == 'Error'; }
  q() { return this.name[0]; }
  qx() { return this.x < 10 ? this.x : (this.x > 10 ? (20-this.x) : 0); }
  qy() { return this.y < 10 ? this.y : (this.y > 10 ? (20-this.y) : 0); }
  nickname() { return this.nicknames && this.nicknames[0]; }
  allNicknames(includeSelf) {
    var nns = this.nicknames && this.nicknames.join(', ') || '';
    return nns ? ((includeSelf && (this.name + ', ') || '') + nns)
               : (includeSelf && this.name || '');
  }
  sgfXY() {
    const AXIS = ' abcdefghijklmnopqrs';
    return AXIS[this.x] + AXIS[20-this.y];
  }
  absNumericXY() { return this.x + ',' + (20-this.y); }
  posName(type) {
    switch(type) {
    case TYPE_NUM: return this.absNumericXY();
    case TYPE_SGF: return this.sgfXY();
    case TYPE_4QN: return this.numericName;
    case TYPE_4Q:
    default:       return this.name;
    }
  }
  whichQ() {
    if (this.x < 10 && this.y < 10) return 1;
    if (this.x < 10 && this.y > 10) return 2;
    if (this.x > 10 && this.y > 10) return 3;
    if (this.x > 10 && this.y < 10) return 4;
    return 0;
  }
  whichCenterLine() { // 1,2,3,4: W,N,E,S
    if (this.y === 10) if (this.x < 10) return 1; else if (this.x > 10) return 3;
    if (this.x === 10) if (this.y < 10) return 4; else if (this.y > 10) return 2;
    return 0;
  }
  isTengen() { return this.x === 10 && this.y === 10; }
  isCenterLine() { return (this.x === 10 || this.y === 10) && !this.isTengen(); }
  isCenterLineOrTengen() { return this.x === 10 || this.y === 10; }
  isInQ() { return this.x !== 10 && this.y !== 10; }
}

class FourQInfoMove {
  constructor(comment) {
    this.name = 'Info';
    this.comment = comment;
  }
  isError() { return false; }
  isInfo() { return true; }
}

const TYPE_4Q  = '4q';
const TYPE_4QN = '4qn';
const TYPE_NUM = 'num';
const TYPE_SGF = 'sqf';
var types = {}, etypes = {};
types[TYPE_4Q]  = '4Q助記符座標';
types[TYPE_4QN] = '4Q純數字座標';
types[TYPE_NUM] = '簡單XY座標（原點左上）';
types[TYPE_SGF] = 'SGF座標（原點左上）';
etypes[TYPE_4Q]  = '4Q Mnemonic';
etypes[TYPE_4QN] = '4Q Pure Numeric';
etypes[TYPE_NUM] = 'Simple XY (From top-left)';
etypes[TYPE_SGF] = 'SGF (From top-left)';

class FourQMove {
  constructor(num, pos, isBlack, comment) {
    this.num = num;
    this.pos = pos;
    this.player = isBlack ? 'B' : 'W';
    if (comment) this.comment = comment;
  }

  getPosName(type) { return this.pos.posName(type); }
  isError() { return !this.pos || this.pos.isError(); }
  isInfo() { return false; }
  errMsg() { return this.pos ? this.pos.errMsg : 'Error.'; }
  toString() { return this.num + '.' + this.pos.name; }
}

class FourQ {
  constructor(txt) {
    this.info = {};
    this.record = [];
    this.parse(txt);
    this.handicap = 0;
    this.startsWithBlack = true;
  }

  _parseSGFHeaders(txt) {
     var a = txt.trim().split(']');
     for (var i in a) {
       var tuple = a[i].split('[');
       if (tuple.length < 2) continue;
       var val = tuple[1].trim();
       switch(tuple[0]) {
       case 'PB': this.info['Player-Black'] = val; break;
       case 'PW': this.info['Player-White'] = val; break;
       case 'BR': this.info['Black-Rank'] = val; break;
       case 'WR': this.info['White-Rank'] = val; break;
       case 'EV': this.info['Event'] = val; break;
       case 'PC': this.info['Place'] = val; break;
       case 'DT': this.info['Date'] = val; break;
       case 'C':  this.info['Comment'] = val; break;
       case 'GS': this.info['Game-Size'] = val; break;
       case 'HA': this.info['Handicap'] = val; break;
       case 'KM': this.info['Komi'] = val; break;
       case 'RE': this.info['Result'] = val; break;
       case 'GN': this.info['Game-Name'] = val; break;
       case 'RU': this.info['Rule'] = val; break;
       }
     }
  }
  parseSGF(txt) { // No branches! only ;B[] and ;W[] records. Other junk is fine.)
    var a = txt.split('\n');
    txt = ''; for (var i in a) txt += a[i].trim();
    if ((txt.indexOf('(;B[') > 0) || (txt.indexOf('(;W[') > 0)) {
      alert('SGF contains branches. Not supported.');
      return;
    }

    var idx1 = txt.indexOf(';B[');
    var idx2 = txt.indexOf(';W[');
    var curB = this.startsWithBlack = idx2 > idx1;
    this._parseSGFHeaders(txt.substring(1, Math.min(idx1,idx2)));
    idx1 = idx2 = 0
    while (true) {
      if (curB)
        idx1 = txt.indexOf(';B[', idx2);
      else
        idx1 = txt.indexOf(';W[', idx2);
      if (idx1 < 0) break;
      idx1 += 3;
      idx2 = txt.indexOf(']', idx1);
      if (idx2 != idx1 + 2) { alert('Invalid SGF coordinates: "' + txt.substring(idx1-3, idx2+1) + '".'); return; }
      var coord = txt.substring(idx1,idx2);
      this.addMove(null, POS_REPO.fromSgfXY(coord), curB);
      idx1 = idx2;
      curB = !curB;
    }
  }

  export4Q(type) {
    var host = this, curB = this.startsWithBlack, ret = '';
    function expHdr(key, defVal) {
      var val = host.info[key] || defVal;
      if (val) {
        var hdr = '#' + key;
        while (hdr.length < 14) hdr += ' ';
        ret +=  hdr + ': ' + val + '\n';
      }
    }
    expHdr('Player-Black', 'Hero Black');
    expHdr('Black-Rank');
    expHdr('Player-White', 'Hero White');
    expHdr('White-Rank');
    expHdr('Game-Size');
    expHdr('Handicap');
    expHdr('Rule');
    expHdr('Komi');
    expHdr('Result');
    expHdr('Place');
    expHdr('Game-Name');
    expHdr('Event');
    expHdr('Date');
    expHdr('Comment');
    expHdr('Source');

    for (var i=0; i<this.record.length; ++i) {
      if ((i % 10 === 0) && (i > 0)) ret += ' // ' + (i-9) + ' to ' + i + '\n';
      else if (i>0) ret += ' ';
      var n = this.record[i].getPosName(type);
      while (n.length < 3) n += ' ';
      ret += n;
      curB = !curB;
    }
    return ret;
  }

  exportSGF() {
    var host = this, curB = this.startsWithBlack,
        ret = '(;FF[4]CA[UTF-8]AP[4QtoSGF]\n';

    function expHdr(key, sgfName, defVal) {
      var val = host.info[key] || defVal;
      if (val) ret +=  sgfName + '[' + val + ']\n';
    }
    expHdr('Player-Black', 'PB', 'Hero Black');
    expHdr('Black-Rank', 'BR');
    expHdr('Player-White', 'PW', 'Hero White');
    expHdr('White-Rank', 'WR');
    expHdr('Game-Size', 'GS');
    expHdr('Handicap', 'HA');
    expHdr('Komi', 'KM');
    expHdr('Rule', 'RU');
    expHdr('Result', 'RE');
    expHdr('Game-Name', 'GN');
    expHdr('Event', 'EV');
    expHdr('Place', 'PC');
    expHdr('Date', 'DT');
    expHdr('Comment', 'C');

    for (var i=0; i<this.record.length; ++i) {
      if ((i % 10 === 0) && (i > 0)) ret += '\n';
      ret += ';' + (curB ? 'B' : 'W') + '[' + this.record[i].pos.sgfXY() + ']';
      curB = !curB;
    }
    return ret + ')';
  }

  getDescription() { return this.info["Black-Player"] + '-' + this.info["White-Player"]; }
  numOfMoves() { return this.record.length; }
  addMove(moveNum, coord, isBlack, comment) { // moveNum default is for the latest move
    if (!moveNum) moveNum = this.record.length+1;
    if ((typeof coord === 'string') && ('123456789'.indexOf(coord[0]) >= 0)) coord = DEFAULT_Q + coord;
    var mv, pos = coord.sgfXY ? coord : POS_REPO.from4Q(coord);
    if (!pos) pos = new FourQPosErr('Invalid coordinate: ' + coord);
    this.record[moveNum-1] = mv = new FourQMove(moveNum, pos, isBlack, comment);
    return mv;
  }

  _setErr(txt) {
    this.errMsg = { type:'error', lineNum:this._curLineNum, msg:txt };
  }

  parse(txt) {
    if (!txt) return this;
    var isB = true; // TODO: generalize
    var a = txt.split('\n'), x;
    var mvnum = 1;
    for (var i=0; i<a.length; ++i) {
      this._curLineNum = i+1; // for potential error messages
      var ln = a[i].trim();
      if (ln.length === 0)
        continue;
      if (ln[0] === '#') { // game info
        x = ln.substring(1).split(':');
        if (x.length === 1) this.info[x] = true;
        else {
          var key = x[0].trim();
          if (key.toLowerCase() == '!set') { // e.g. #SET: DEFAULT_Q = A
            key = x[1].split('=');
            window[key[0].trim()] = key.length > 1 ? key[1].trim() : true;
          }
          else this.info[key] = x[1].trim();
        }
      }
      else if (ln.startsWith('//')) { // game-wise comment
        ; // TODO: handle game-wise comment
      }
      else { // record lines
        var idx = ln.indexOf('//');
        if (idx > 0) ln = ln.substring(0,idx).trim();
        x = ln.split(' ');
        for (var y in x) {
          var val = x[y];
          if (!val) continue;
          if (this._parseCoord(mvnum, isB, val)) {
            ++mvnum;
            isB = !isB;
          }
        }
      }
    }
    this.isGood = !this.errMsgs;
    delete this._curLineNum;
    return this;
  }

  _parseCoord(num, isB, txt) {
    txt = txt.replaceAll('_', '').trim();
    if (txt.length === 0) return null;
    var idx = txt.indexOf('//'), comment;
    if (idx > 0) {
      comment = txt.substring(idx+2).trim();
      txt = txt.substring(0, idx).trim();
    }
    var num, a = txt.split(':');
    if (a.length > 1) {
      num = parseInt(a[0].trim());
      a = a[1].trim();
    }
    return this.addMove(num, a, isB, comment);
  }

} // end of class FourQ.

function today() {
  var date = new Date();
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate());
  return date.getFullYear() + '-' + M + D;
}

// ----------------------------------------------------------------------
// Data for special points
// ----------------------------------------------------------------------

(() => {
  var a = `
# 天元，四中線
O 10 10 天元 Tengen
E 16 10 右邊星 東邊星 E-star
S 10 4 下邊星 南邊星 S-star
W 4 10 左邊星 西邊星 W-star
N 10 16 上邊星 北邊星 N-star
EO 13 10 右邊星天元中分 東邊星天元中分
SO 10 7 下邊星天元中分 南邊星天元中分
WO 7 10 左邊星天元中分 西邊星天元中分
NO 10 13 上邊星天元中分 北邊星天元中分

# 第一象限（左下）
A 4 4 左下星 LL-star A4 A44
AO 7 7 A7 A77 左下星天元中分
AS 7 4 A74 左下星南中分
AW 4 7 A47 左下星西中分

# 第二象限（左下）
B 4 16 左上星 UL-star B4 B44
BO 7 13 B7 左上星天元中分
BN 7 16 B74 左上星北中分
BW 4 13 B47 左上星西中分

# 第三象限（右上）
C 16 16 右上星 UR-star C4 C44
CO 13 13 C7 右上星天元中分
CN 13 16 C74 右上星北中分
CE 16 13 C47 右上星東中分

# 第四象限（右下）
D 16 4 右下星 LR-star D4 D44
DO 13 7 右下星天元中分
DS 13 4 右下星南中分
DE 16 7 右下星東中分
`.split('\n');

  function localqn(n, x, y) { return n + x + '' + y }
  function addSpecial(...args) {
    var pos = new FourQPos(...args);
    // Add 上 下 左 右
    switch(pos.name) {
    case 'O':  new FourQPos('O<',   9, 10, 'W9', '天元左');
               new FourQPos('O>',  11, 10, 'E9', '天元右');
               new FourQPos('O^',  10, 11, 'N9', '天元上');
               new FourQPos('Ov',  10,  9, 'S9', '天元下'); break;
    case 'E':  new FourQPos('E<',  15, 10, 'E5',  '右邊星左', '東邊星左');
               new FourQPos('E>',  17, 10, 'E3',  '右邊星右', '東邊星右');
               new FourQPos('E^',  16, 11, 'C49', '右邊星上', '東邊星上');
               new FourQPos('Ev',  16,  9, 'D49', '右邊星下', '東邊星下'); break;
    case 'W':  new FourQPos('W<',   3, 10, 'W3',  '左邊星左', '西邊星左');
               new FourQPos('W>',   5, 10, 'W5',  '左邊星右', '西邊星右');
               new FourQPos('W^',   4, 11, 'B49', '左邊星上', '西邊星上');
               new FourQPos('Wv',   4,  9, 'A49', '左邊星下', '西邊星下'); break;
    case 'S':  new FourQPos('S<',   9,  4, 'A94', '下邊星左', '南邊星左');
               new FourQPos('S>',  11,  4, 'D94', '下邊星右', '南邊星右');
               new FourQPos('S^',  10,  5, 'S5',  '下邊星上', '南邊星上');
               new FourQPos('Sv',  10,  3, 'S3',  '下邊星下', '南邊星下'); break;
    case 'N':  new FourQPos('N<',   9, 16, 'B94', '上邊星左', '北邊星左');
               new FourQPos('N>',  11, 16, 'C94', '上邊星右', '北邊星右');
               new FourQPos('N^',  10, 17, 'N3',  '上邊星上', '北邊星上');
               new FourQPos('Nv',  10, 15, 'N5',  '上邊星下', '北邊星下'); break;
    case 'EO': new FourQPos('EO<', 12, 10, 'E8');
               new FourQPos('EO>', 14, 10, 'E6');
               new FourQPos('EO^', 13, 11, 'C79');
               new FourQPos('EOv', 13,  9, 'D79'); break;
    case 'WO': new FourQPos('WO<',  6, 10, 'W6');
               new FourQPos('WO>',  8, 10, 'W8');
               new FourQPos('WO^',  7, 11, 'B79');
               new FourQPos('WOv',  7,  9, 'A79'); break;
    case 'SO': new FourQPos('SO<',  9,  7, 'A97');
               new FourQPos('SO>', 11,  7, 'D97');
               new FourQPos('SO^', 10,  8, 'S8');
               new FourQPos('SOv', 10,  6, 'S6'); break;
    case 'NO': new FourQPos('NO<',  9, 13, 'B97');
               new FourQPos('NO>', 11, 13, 'C97');
               new FourQPos('NO^', 10, 14, 'N6');
               new FourQPos('NOv', 10, 12, 'N8'); break;
    default: // 角星及其中分點
      var zname;
      for (var i=3; i<args.length; ++i)
        if (args[i].indexOf('星') >= 0) { zname = args[i]; break; }
      var q = pos.q(), x = pos.x, y = pos.y;
      switch(q) {
      case 'A': new FourQPos(pos.name+'<', x-1, y, localqn(q, x-1, y), zname+'左');
                new FourQPos(pos.name+'>', x+1, y, localqn(q, x+1, y), zname+'右');
                new FourQPos(pos.name+'^', x, y+1, localqn(q, x, y+1), zname+'上');
                new FourQPos(pos.name+'v', x, y-1, localqn(q, x, y-1), zname+'下'); break;
      case 'B': new FourQPos(pos.name+'<', x-1, y, localqn(q, x-1, 20-y), zname+'左');
                new FourQPos(pos.name+'>', x+1, y, localqn(q, x+1, 20-y), zname+'右');
                new FourQPos(pos.name+'^', x, y+1, localqn(q, x, 20-y-1), zname+'上');
                new FourQPos(pos.name+'v', x, y-1, localqn(q, x, 20-y+1), zname+'下'); break;
      case 'C': new FourQPos(pos.name+'<', x-1, y, localqn(q, 20-x+1, 20-y), zname+'左');
                new FourQPos(pos.name+'>', x+1, y, localqn(q, 20-x-1, 20-y), zname+'右');
                new FourQPos(pos.name+'^', x, y+1, localqn(q, 20-x, 20-y-1), zname+'上');
                new FourQPos(pos.name+'v', x, y-1, localqn(q, 20-x, 20-y+1), zname+'下'); break;
      case 'D': new FourQPos(pos.name+'<', x-1, y, localqn(q, 20-x+1, y), zname+'左');
                new FourQPos(pos.name+'>', x+1, y, localqn(q, 20-x-1, y), zname+'右');
                new FourQPos(pos.name+'^', x, y+1, localqn(q, 20-x, y+1), zname+'上');
                new FourQPos(pos.name+'v', x, y-1, localqn(q, 20-x, y-1), zname+'下'); break;
      }
      break;
    }
  }

  var i, j;
  for (i in a) {
    var ln = a[i].trim();
    var idx = ln.indexOf('#');
    if (idx >= 0) ln = ln.substring(0, idx).trim();
    if (ln.length > 0) addSpecial(...ln.split(' '));
  }

  for (i=1; i<10; ++i) {
    new FourQPos('E'+i, 20-i, 10);
    new FourQPos('S'+i, 10, i);
    new FourQPos('W'+i, i, 10);
    new FourQPos('N'+i, 10, 20-i);
    new FourQPos('A'+i, i, i, localqn('A',i,i));
    new FourQPos('B'+i, i, 20-i, localqn('B',i,i));
    new FourQPos('C'+i, 20-i, 20-i, localqn('C',i,i));
    new FourQPos('D'+i, 20-i, i, localqn('D',i,i));
  }

  // alternatively, create generic positions on-demand.
  for (i=1; i<10; ++i) for (j=1; j<10; ++j) {
    new FourQPos('A'+i+j, i, j);
    new FourQPos('B'+i+j, i, 20-j);
    new FourQPos('C'+i+j, 20-i, 20-j);
    new FourQPos('D'+i+j, 20-i, j);
  }
})();

