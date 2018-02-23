
const $ = function( id ) { return document.getElementById( id ); }; let eleForm = $( 'form' ),
  eleFile = $( 'file' ),
  eleSubmit = $( 'submit' ),
  eleUploadUl = $( 'uploadUl' ),
  eleTemplate = $( 'fileTemplate' ); let fileArray = [],
    fileSplitSize = 1024 * 100,
    htmlTemplate = eleTemplate && eleTemplate.innerHTML || ''; if ( typeof history.pushState === 'function' ) {
      const objStateElement = ( function() {
        const _$ = function( name, fileid ) { return $( `file${name}_${fileid}` ) || { innerHTML: '' }; }; return { backgroundSize( params, percent ) { const dom = typeof params === 'string' ? $( `filelist_${params}` ) : params; if ( dom ) { dom.style.mozBackgroudSize = `${percent}% 100%`; dom.style.backgroundSize = `${percent}% 100%`; } },
          wait( fileid ) { _$( 'status', fileid ).innerHTML = '<span class="uploading">上传中...</span>'; _$( 'operate', fileid ).innerHTML = `<a href="javascript:" data-type="pause" data-id="${fileid}">暂停</a>`; },
          keep( fileid ) { _$( 'status', fileid ).innerHTML = '<span class="waiting">等待续传...</span>'; },
          success( fileid, time ) {
            let eleList = $( `filelist_${fileid}` ),
              eleOperate = $( `fileoperate_${fileid}` ),
              eleStatus = $( `filestatus_${fileid}` ); this.backgroundSize( eleList, '0' ); eleStatus.id = ''; eleOperate.id = ''; eleList.id = ''; localStorage.removeItem( fileid ); eleStatus.innerHTML = `<span class="success">${( performance.now() - time > 1000 ) ? '上' : '秒'}传成功！</span>`; eleOperate.innerHTML = ''; console.log([ performance.now(), time ].join());
          },
          error( fileid ) { _$( 'status', fileid ).innerHTML = '<span class="error">出现异常！</span>'; _$( 'operate', fileid ).innerHTML = `<a href="javascript:" data-type="try" data-id="${fileid}">重试</a>`; } };
      }()); var funFileUpload = function( fileid, onsuccess, onerror, onpause ) {
        let file = fileArray[fileid],
          now = performance.now(); if ( !fileid || !file ) { return; }onsuccess = onsuccess || function() { funFileUpload( fileArray[0]); }; onerror = onerror || function() { funFileUpload( fileArray[fileArray.indexOf( fileid ) + 1]); }; onpause = onpause || function() { funFileUpload( fileArray[fileArray.indexOf( fileid ) + 1]); }; if ( file.flagPause == true ) { onpause.call( fileid ); return; }objStateElement.wait( fileid ); let size = file.size,
            start = $( `filelist_${fileid}` ).filesize; if ( size == start ) { fileArray.shift(); if ( delete fileArray[fileid]) { console.log( `${fileArray.join()}---上传成功` ); }objStateElement.success( fileid, now ); onsuccess.call( fileid, {}); return; } var funFileSize = function() { if ( file.flagPause == true ) { onpause.call( fileid ); return; } const data = new FormData(); data.append( 'name', encodeURIComponent( file.name )); data.append( 'fileid', fileid ); data.append( 'file', file.slice( start, start + fileSplitSize )); data.append( 'start', `${start}` ); const xhr = new XMLHttpRequest(); xhr.open( 'post', eleForm.action, true ); xhr.setRequestHeader( 'X_Requested_With', location.href.split( '/' )[5].replace( /[^a-z]+/g, '$' )); xhr.upload.addEventListener( 'progress', ( e ) => { objStateElement.backgroundSize( fileid, ( e.loaded + start ) / size * 100 ); }, false ); xhr.onreadystatechange = function( e ) { if ( xhr.readyState == 4 ) { if ( xhr.status == 200 ) { try { var json = JSON.parse( xhr.responseText ); } catch ( e ) { objStateElement.error( fileid ); return; } if ( !json || !json.succ ) { objStateElement.error( fileid ); onerror.call( fileid, json ); return; } if ( start + fileSplitSize >= size ) { fileArray.shift(); if ( delete fileArray[fileid]) { console.log( `${fileArray.join()}---上传成功` ); }objStateElement.success( fileid, now ); onsuccess.call( fileid, json ); } else { localStorage.setItem( fileid, `${start}` ); start += fileSplitSize; console.log( start ); funFileSize(); } } else { objStateElement.error( fileid ); } } }; xhr.send( data ); }; funFileSize();
      }; eleForm.addEventListener( 'submit', ( event ) => { funFileUpload( fileArray[0]); event.preventDefault(); }); eleFile.addEventListener( 'change', ( event ) => {
        const files = event.target.files; let htmlFile = '',
          index = 0,
          length = files.length; for ( ;index < length; index++ ) {
            const file = files[index]; let name = file.name,
            size = file.size,
            type = file.type || '',
            id = ( `${file.lastModifiedDate}` ).replace( /\W/g, '' ) + size + type.replace( /\W/g, '' ); var objHtml = { id, type: 'cloud', name, size: `${size}B`, status: '<span class="waiting">等待上传</span>', operate: `<a href="javascript:" data-type="delete" data-id="${id}">删除</a>` }; if ( name.length > 50 ) { objHtml.name = `<span title="${name}">${name.slice( 0, 20 )}...${name.slice( -20 )}</span>`; } const format = name.split( '.' ); objHtml.type = format[format.length - 1] || 'unknown'; if ( size > 1024 * 1024 ) { objHtml.size = `${Math.round( size / ( 1024 * 1024 ) * 10 ) / 10}M`; } else if ( size > 1024 ) { objHtml.size = `${Math.round( size / 1024 * 10 ) / 10}KB`; } if ( size > 1024 * 200 ) { objHtml.id = Math.random(); objHtml.status = '<span class="error">文件过大</span>'; objHtml.operate = ''; } else if ( fileArray.indexOf( id ) != -1 ) { objHtml.id = Math.random(); objHtml.status = '<span class="error">文件已存在</span>'; objHtml.operate = ''; } else { fileArray.push( id ); fileArray[id] = file; }htmlFile += htmlTemplate.replace( /\$\w+\$/gi, ( matchs ) => { const returns = objHtml[matchs.replace( /\$/g, '' )]; return ( `${returns}` ) == 'undefined' ? '' : returns; });
          } if ( htmlFile !== '' ) {
          eleSubmit.style.visibility = 'visible'; eleUploadUl.style.display = 'table'; eleUploadUl.insertAdjacentHTML( 'beforeEnd', htmlFile ); const nameArray = fileArray.map(( fileid ) => {
        let nameSplit = fileArray[fileid].name.split( '.' ),
          name = nameSplit[nameSplit.length - 1]; return `${fileid}.${name}`;
      }); const xhr_filesize = new XMLHttpRequest();
          xhr_filesize.open( 'GET', `filesize.php?filename=${nameArray.join()}`, true ); xhr_filesize.onreadystatechange = function( e ) { if ( xhr_filesize.readyState == 4 ) { if ( xhr_filesize.status == 200 && xhr_filesize.responseText ) { const json = JSON.parse( xhr_filesize.responseText ); if ( json.succ && json.data ) { for ( const key in json.data ) { if ( json.data[key] > 0 && json.data[key] < fileArray[key].size ) { objStateElement.backgroundSize( key, json.data[key] / fileArray[key].size * 100 ); objStateElement.keep( key ); }$( `filelist_${key}` ).filesize = json.data[key]; } } } } }; xhr_filesize.send();
        }eleForm.reset();
      }); eleUploadUl.addEventListener( 'click', ( event ) => {
        let target = event.target,
          id = target && target.getAttribute( 'data-id' ); if ( id && /^a$/i.test( target.tagName )) { switch ( target.getAttribute( 'data-type' )) { case 'delete':var filelist = $( `filelist_${id}` ); if ( filelist ) { filelist.style.opacity = 0; fileArray.splice( fileArray.indexOf( id ), 1 ); if ( delete fileArray[id]) { console.log( `${fileArray.join()}---删除成功` ); }setTimeout(() => { filelist.parentNode.removeChild( filelist ); if ( fileArray.length == 0 ) { eleSubmit.style.visibility = 'hidden'; eleUploadUl.style.display = 'none'; } }, 220 ); } break; case 'pause':var eleStatus = $( `filestatus_${id}` ); if ( fileArray[id]) { fileArray[id].flagPause = true; target.setAttribute( 'data-type', 'reupload' ); target.innerHTML = '继续'; if ( eleStatus ) { eleStatus.innerHTML = '上传暂停'; } } break; case 'try':case 'reupload':funFileUpload( id, () => {}, () => {}, () => {}); } }
      });
    } else { eleUploadUl.style.display = 'block'; eleUploadUl.innerHTML = '<li class="error"><p style="margin:.5em 1em;">当前浏览器不支持！试试IE10+, Chrome等~</p></li>'; }
