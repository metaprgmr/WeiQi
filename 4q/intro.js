function w(){for(var i in arguments)document.write(arguments[i])}
function e(id) { return document.getElementById(id) }

function writeLine(ln, prefix, showLM2, showSamples, demoLines) {
  if (prefix) w(prefix);
  var active = false;
  for (var i=0; i<ln.length; ++i) {
    var c = ln[i];
    if (active) {
      switch (c) {
      case ' ': w(' '); break;
      case '*': w('<sta>', c, '</sta>'); break;
      case '@': if (demoLines) w('<ln>+</ln>'); else w('+'); break;
      case '&': if (demoLines) { w('<ln>', showLM2?'<lm2>#</lm2>':'+', '</ln>'); break; } // else, do the next
      case '#':
      case '^':
      case '<':
      case '>':
      case 'v': if (showLM2) w('<lm2>', c, '</lm2>'); else w('+'); break;
      case '|': w('</bd>'); active = false; break;
      default:
        if (' ABCDESWNO'.indexOf(c) > 0)
          w('<lm1>', c, '</lm1>');
        else if (' abcdefghijklmnpqrstuwxyz'.indexOf(c) > 0) {
          if (showSamples) w('<ex>', c, '</ex>'); else w('+');
        }
        else w(c);
        break;
      }
    } else if (c == '|') { w('<bd>'); active = true; }
    else w(c);
  }
  w('\n');
}
function drawBoard(bd, showLM2, showSamples, demoLines) {
  var prefix = '';
  var tbBar ='   1 2 3   5 6   8 9   9 8   6 5   3 2 1';
  w('<pre class="bdfont">', prefix, tbBar, '\n\n');
  var a = bd.split('\n');
  for (var i=0; i<a.length; ++i)
    writeLine(a[i], prefix, showLM2, showSamples, demoLines);
  w('\n', prefix, tbBar, '</pre>');
}

function showGame(gm) {
  w('<pre class="bdfont">');
  var a = gm.split('\n');
  var blacks = ' 13579bdfhjln',
      whites = ' 2468acegikm';
  for (var i in a) {
    var ln = a[i];
    w('<bd>');
    for (var j=0; j<ln.length; ++j) {
      var c = ln[j];
      if (c == '*') w('<sta>*</sta>');
      else {
        if (blacks.indexOf(c) > 0) w('<bla>', c, '</bla>');
        else if (whites.indexOf(c) > 0) w('<whi>', c, '</whi>');
        else w(c);
      }
    }
    w('</bd>\n');
  }
  w('\n</pre>');
}

var board0 =
`1  |+ + + + + + + + + @ + + + + + + + + +|  1
2  |+ + + + + + + + + @ + + + + + + + + +|  2
3  |+ + + + + + + + + @ + + + + + + + + +|  3
   |+ + + B + + # + + N + + # + + C + + +|   
5  |+ + + + + + + + + @ + + + + + + + + +|  5
6  |+ + + + + + + + + @ + + + + + + + + +|  6
   |+ + + # + + # + + & + + # + + # + + +|   
8  |+ + + + + + + + + @ + + + + + + + + +|  8
9  |+ + + + + + + + + @ + + + + + + + + +|  9
   |@ @ @ W @ @ & @ @ O @ @ & @ @ E @ @ @|   
9  |+ + + + + + + + + @ + + + + + + + + +|  9
8  |+ + + + + + + + + @ + + + + + + + + +|  8
   |+ + + # + + # + + & + + # + + # + + +|   
6  |+ + + + + + + + + @ + + + + + + + + +|  6
5  |+ + + + + + + + + @ + + + + + + + + +|  5
   |+ + + A + + # + + S + + # + + D + + +|   
3  |+ + + + + + + + + @ + + + + + + + + +|  3
2  |+ + + + + + + + + @ + + + + + + + + +|  2
1  |+ + + + + + + + + @ + + + + + + + + +|  1`;

var board1 =
`1  |+ + + + + + + + + @ + + + + + + + + +|  1
2  |+ + + + + + + + + @ + + + + + + + + +|  2
3  |+ + + + + + + + + @ + + + i + + k + +|  3
   |+ + + B + f # + + N + + # + + C + + +|   
5  |+ + + + + + + + + @ + + + + + + + + +|  5
6  |+ + + g + h + + + @ + + + + + + + + +|  6
   |+ + + # + + # + + & + + # + + # j + +|   
8  |+ + + + + + + + + @ + + + + + + + + +|  8
9  |+ + + + + + + + + @ + + + + + + + + +|  9
   |@ @ c W @ @ e @ @ O p @ & @ @ E @ @ @|   
9  |+ + + + + + d + + @ + + + + + + + l +|  9
8  |+ + + + + + + + + @ + + + + + + + + +|  8
   |+ + + # + + # + + & + + # + + # + + +|   
6  |+ + + + + + + + + @ + + + + + + + + +|  6
5  |+ b + + + + + + + q + + + + + m + + +|  5
   |+ + + A + + # + + S + + # + n D + + +|   
3  |+ + + + + + + + + @ + + + + + + + + +|  3
2  |+ + a + + + + + + @ + + + + + + + + +|  2
1  |+ + + + + + + + + @ + + + + + + + + +|  1`;

var board2 =
`1  |+ + + + + + + + + + + + + + + + + + +|  1
2  |+ + + + + + + + + + + + + + + + + + +|  2
3  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  3
   |+ + < B > < # > < N > < # > < C > + +|   
5  |+ + + v + + v + + v + + v + + v + + +|  5
6  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  6
   |+ + < # > < # > < # > < # > < # > + +|   
8  |+ + + v + + v + + v + + v + + v + + +|  8
9  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  9
   |+ + < W > < # > < O > < # > < E > + +|   
9  |+ + + v + + v + + v + + v + + v + + +|  9
8  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  8
   |+ + < # > < # > < # > < # > < # > + +|   
6  |+ + + v + + v + + v + + v + + v + + +|  6
5  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  5
   |+ + < A > < # > < S > < # > < D > + +|   
3  |+ + + v + + v + + v + + v + + v + + +|  3
2  |+ + + + + + + + + + + + + + + + + + +|  2
1  |+ + + + + + + + + + + + + + + + + + +|  1`;

// For tools

var sampleC3_A_O =
`(;FF[4]CA[UTF-8]AP[GoGui]
PB[吴清源]PW[秀哉]DT[1933-10-16]GN[C3-A-O]
;B[qc];W[cd];B[dp];W[pq];B[jj];W[pd];B[qd];W[pe];B[ob];W[qn]
;B[jp];W[lq];B[dj];W[ed];B[lo];W[nq];B[kq];W[lp];B[ko];W[ch]
;B[gj];W[fq];B[fo];W[iq];B[gp];W[cq];B[cp];W[dq];B[nd];W[ph]
;B[pj];W[ne];B[me];W[mf];B[nf];W[ng];B[oe];W[of];B[ne];W[nj]
;B[om];W[mg];B[ke];W[hc];B[qm];W[rm];B[rn];W[rl];B[ro];W[pm]
;B[ql];W[qk];B[pl];W[pn];B[pk];W[qj];B[nl];W[pi];B[qp];W[on]
;B[nn];W[no];B[mo];W[op];B[qr];W[qq];B[rq];W[pr];B[rr];W[mn]
;B[nm];W[lm];B[ll];W[kp];B[mp];W[mq];B[ip];W[jq];B[kk];W[cn]
;B[ep];W[cj];B[ck];W[dk];B[cl];W[dl];B[ci];W[bj];B[bi];W[di]
;B[ej];W[bh];B[dm];W[ei];B[fj];W[cm];B[ak];W[ai];B[el];W[bp]
;B[rf];W[co];B[qg];W[rh];B[jc];W[gq];B[eq];W[en];B[fn];W[er]
;B[fr];W[dr];B[hq];W[hr];B[hp];W[gr];B[fc];W[ic];B[dc];W[cc]
;B[gd];W[he];B[ge];W[je];B[hd];W[id];B[hf];W[kd];B[le];W[kc]
;B[og];W[oh];B[pg];W[em];B[ek];W[fm];B[gm];W[mb];B[cb];W[ec]
;B[eb];W[dd];B[db];W[gb];B[bc];W[bd];B[bb];W[nb];B[oa];W[fb]
;B[ea];W[gh];B[jf];W[ie];B[ff];W[hi];B[hg];W[eo];B[fp];W[hl]
;B[il];W[jh];B[fh];W[fi];B[hj];W[if];B[ih];W[ii];B[ig];W[jg]
;B[ji];W[fg];B[kf];W[ij];B[ik];W[hh];B[gf];W[mk];B[df];W[ml]
;B[sm];W[sk];B[mm];W[dg];B[li];W[ol];B[ln];W[nk];B[km];W[fl]
;B[gl];W[oj];B[qh];W[ri];B[cf];W[ef];B[gi];W[eh];B[ee];W[eg]
;B[de];W[bf];B[bq];W[br];B[ps];W[os];B[qs];W[oq];B[bo];W[aq]
;B[an];W[bn];B[am];W[ao];B[rg];W[mi];B[qi];W[lh];B[kh];W[lj]
;B[rj];W[rk];B[sh];W[sj];B[bg];W[ae];B[cg];W[ag];B[fe];W[gc]
;B[fd];W[ce];B[kg];W[mc];B[ki];W[fk];B[ld];W[lc];B[gk];W[bk]
;B[bl];W[na];B[nc];W[gg];B[fa];W[ga];B[ac];W[ad];B[lg];W[mh]
;B[qo];W[lk])`;
var sampleSGF =
`(;FF[4]CA[UTF-8]AP[4QtoSGF]
PB[賴均輔]
BR[8p]
PW[姜東潤]
WR[9p]
KM[6.5]
RE[B+res]
EV[第29届LG杯世界棋王战24进16]
PC[韓國]
DT[2024-5-20]
;B[pd];W[dd];B[qp];W[dp];B[op];W[qc];B[pc];W[qd];B[qf];W[rf]
;B[rg];W[qe];B[pf];W[pe];B[oe];W[od];B[ob];W[nd];B[ne];W[me]
;B[mf];W[mc];B[qb];W[re];B[qh];W[rb];B[ra];W[rc];B[le];W[md]
;B[mb];W[lb];B[nb];W[lf];B[mg];W[kc];B[sd];W[sb];B[sf];W[se]
;B[sg];W[ma];B[na];W[la];B[qa];W[pb];B[oc];W[pa];B[oa];W[pb]
;B[pa];W[lg];B[lh];W[mh];B[of];W[kh];B[li];W[ke];B[rd];W[nc]
;B[mi];W[nm];B[pm];W[pl];B[ql];W[mp];B[mn];W[jp];B[kn];W[qm]
;B[pn];W[jl];B[io];W[ll];B[ip];W[ki];B[iq];W[qk];B[rl];W[ol]
;B[rk];W[oo];B[np];W[no];B[mo];W[po];B[qo];W[pp];B[pq];W[om]
;B[qn];W[df];B[fd];W[ec];B[fg];W[eh];B[gi];W[jg];B[jd];W[kd]
;B[ij];W[fj];B[gj];W[fk];B[hl];W[im];B[jo];W[lj];B[fh];W[eg]
;B[mj];W[jj];B[ff];W[fm];B[fc];W[co];B[hm];W[gq];B[eq];W[ep]
;B[cc];W[hr];B[ce];W[de];B[bf];W[cd];B[bd];W[cf];B[be];W[bg]
;B[bh];W[cg];B[dc];W[qq];B[pr];W[ir];B[ci];W[dj];B[ag];W[mq]
;B[nr];W[nq];B[oq];W[mr];B[qr];W[jq];B[ml];W[mm];B[lk];W[kk]
;B[kj];W[km];B[hn];W[ck];B[ji];W[lj];B[di];W[ei];B[kj];W[jk]
;B[jh];W[lj];B[kr];W[jr];B[kj];W[kg];B[mk];W[lj];B[cq];W[dq]
;B[kj];W[oj];B[pi];W[il];B[lr];W[lp];B[lo];W[lm];B[gl];W[ig]
;B[hh];W[in];B[fl];W[ns];B[fp];W[jn];B[fq];W[ho];B[dr];W[hp]
;B[cm];W[el];B[dn];W[en];B[bo];W[cr];B[dl];W[ek];B[eo];W[bq]
;B[fn];W[em];B[do];W[cp];B[go];W[af];B[ae];W[bj];B[bp];W[er]
;B[cn];W[ds];B[bi];W[eb];B[bb];W[ed];B[fb];W[fe];B[ge];W[ef]
;B[ee];W[cl];B[dm];W[fe];B[hf];W[fa];B[hb];W[hc];B[ic];W[bl]
;B[ak];W[ib];B[ga];W[id];B[hd];W[bm];B[bn];W[aj];B[dh];W[jc]
;B[hg])`;

var sample4q = 
`#Player-Black : 賴均輔
#Black-Rank   : 8p
#Player-White : 姜東潤
#White-Rank   : 9p
#Komi         : 6.5
#Result       : B+res
#Event        : 第29届LG杯世界棋王战24进16
#Place        : 韓國
#Date         : 2024-5-20
#Source       : https://foxwq.com/qipu/newlist/id/2024052056765659.html
C   B   D>  A   D<  C3  C^  C>  C36 C26 // 1 - 10
C27 C35 CE^ Cv  C5  C<  C52 CN> C65 CNv // 11 - 20
CO^ CN^ C32 C25 C38 C2  C21 C23 C85 CN  // 21 - 10
C72 C82 C62 C86 CO  C93 C14 C12 C16 C15 // 31 - 40
C17 C71 C61 C81 C31 C42 C53 C41 C51 C42 // 41 - 50
C41 CO< C8  COv C56 C98 C89 C95 C24 C63 // 51 - 60
EO^ DO> DE  DE^ D38 DS  DOv S   D96 DE> // 61 - 70
DEv SO^ A95 D8  S<  C9  A93 D39 D28 D58 // 71 - 80
D29 D5  DS> D65 DS^ D^  D35 D   Dv  DE< // 81 - 90
D36 BW^ BN< B53 BO< B58 WO^ NO  N   N>  // 91 - 100
O<  WO< W7  A69 A8  SO< S^  EO< B68 BW> // 101 - 110
EO  O   B6  AO< B63 A35 AO> ASv A53 A>  // 111 - 120
B3  A82 B35 Bv  B26 B<  B24 B36 B25 B27 // 121 - 130
B28 BW< B^  D3  D42 A92 B39 W   B17 DSv // 131 - 140
D62 D63 D53 D72 D32 Sv  DO^ D7  D89 D9  // 141 - 150
O>  SO> A86 A39 O^  EO< W^  B59 O>  Ov  // 151 - 160
NOv EO< D92 S2  O>  NO> EOv EO< A3  Av  // 161 - 170
O>  E<  E^  A98 D82 DS< D85 DO< AO^ NO< // 171 - 180
B8  A96 A68 D61 AS< SOv A63 A85 A42 AS> // 181 - 190
AW< A58 AWv A56 A25 A32 AW^ A59 A5  A23 // 191 - 200
A6  AW> A^  A<  AS^ B16 B15 W2  A24 A52 // 201 - 210
A36 A41 B29 B52 B2  B>  B62 B65 BNv B56 // 211 - 220
B5  A38 AW  B65 B86 B61 B82 B83 B93 A28 // 221 - 230
A19 B92 B71 N<  BN> A27 A26 W1  BWv N^  // 231 - 240
BO>`;

var template = 
`#Player-Black : 黑山大俠
#Black-Rank   : 7d
#Player-White : 白水妙仙
#White-Rank   : 7d
#Game-Size    : 19
#Handicap     : 0
#Komi         : 6.5
#Result       : B+res 白中盘胜 黑赢12.5目 W+0.5
#Game-Name    : 本局名称
#Event        : 比赛、活动名称
#Place        : 地点
#Comment      : 随便记点什么
#Date         : 2024-5-20
C3_ B<_ A__ Dv_ O__ ___ ___ ___ ___ ___ // 1 - 10
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 11 - 20
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 21 - 10
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 31 - 40
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 41 - 50
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 51 - 60
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 61 - 70
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 71 - 80
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 81 - 90
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 91 - 100
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 101 - 110
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 111 - 120
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 121 - 130
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 131 - 140
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 141 - 150
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 151 - 160
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 161 - 170
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 171 - 180
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 181 - 190
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 191 - 200
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 201 - 210
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 211 - 220
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 221 - 230
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ // 231 - 240
___ ___ ___ ___ ___ ___ ___`;

function setSample(txt) { e('editor').value = txt; e('result').innerHTML = ''; }

var LANG = 'zh';
function generate(type) {
  var en = LANG == 'en';
  var txt = e('editor').value.trim();
  if (txt.startsWith('(') && txt.endsWith(')')) { // SGF
    var game = new FourQ();
    game.parseSGF(txt);
    var lnk = '<a href="javascript:generate';
    if (type == TYPE_4QN)
      lnk += '()">' + (en ? 'Use 4Q Mnemonics' : '使用4Q助记符')  + '</a>';
    else
      lnk += '(TYPE_4QN)">' + (en ? 'Use 4Q Numbers Only' : '使用4Q纯数字') + '</a>';
    e('result').innerHTML = '<pre>' + game.export4Q(type) + '</pre><p>&nbsp;<br>' + lnk + '</p>';
  } else {
    var game = new FourQ(txt);
    e('result').innerHTML = '<pre>' + game.exportSGF() + '</pre>';
  }
}

function showToolUI(lang) {
  if (lang) LANG = lang;
  var en = LANG == 'en';
  var label0 = en ? 'Set 4Q Template' : '显示4Q模版';
  var label1 = en ? 'Set Sample 4Q' : '显示4Q实例';
  var label2 = en ? 'Set Sample SGF' : '显示SGF实例';
  var label3 = en ? 'Clear' : '清除';
  var label4 = en ? 'Convert' : '转换';
  w(
`<table border=0 width="1000px"><tr><td valign="top">
<textarea id="editor" cols="60" rows="36"></textarea>
<p>
<a href="javascript:setSample(null)">${label3}</a>
&nbsp;&nbsp;&nbsp;<a href="javascript:setSample(template)">${label0}</a>
&nbsp;&nbsp;&nbsp;<a href="javascript:setSample(sample4q)">${label1}</a>
&nbsp;&nbsp;&nbsp;<a href="javascript:setSample(sampleSGF)">${label2}</a>
&nbsp;&nbsp;&nbsp;<a href="javascript:setSample(sampleC3_A_O)">C3-A-O</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick="generate()">${label4}</button></p>
</td>

<td width="15px"></td>

<td valign="top" id="result">
</td></tr></table>`);
}
