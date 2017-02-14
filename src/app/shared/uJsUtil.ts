import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { QueryPart } from './pojo/querypart';

declare var jsPDF : any;
declare var html2canvas : any;

export class UJsUtil
{
    /**
     * Get the user IP throught the webkitRTCPeerConnection
     * @param onNewIP {Function} listener function to expose the IP locally
     * @return undefined
     * /
    public static getUserIP(onNewIP)
    { 
        //onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

        function iterateIP(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function(sdp) {
            sdp.sdp.split('\n').forEach(function(line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });
            
            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function(reason) {
            // An error occurred, so handle the failure to connect
        });

        //listen for candidate events
        pc.onicecandidate = function(ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }
    */

    //base: http://www.techumber.com/html-to-pdf-conversion-using-javascript/
    /* NEEDS:
        <script src="assets/js/jspdf.min.js" async></script>
        <script src="assets/js/html2canvas.min.js" async></script>
    */

    public static doPDF(div:HTMLDivElement, fn:string, setHeight:boolean) : void
    {
        //ATTENTION: does not work with children style:float:left

        //TODO: does it work for Edge.!?

        //TODO: only ONE page supported!!! second page cut off!!!

        //not needed in our case!
        //$('body').scrollTop(0) 

        var ele = $(div);
        //TODO: differentiate between set | unset width/height!
        var cache_width = ele.width();
        var cache_height= ele.height();

        var eCenter = $("#centeroutlet");
        var cache_overflowy = eCenter.css('overflow-y');
        eCenter.css('overflow-y','visible');

        var pdfbuttons = $('.button_pdf');
        pdfbuttons.hide();

        //TODO: do we need more signs for 'please wait, currently working'?
        $("html, body").css("cursor", "progress");

        var a4 = [595, 842]; // for a4 size paper width and height A4 at 72dpi!

        var getCanvas = function()
        {
            if(setHeight)
            {
                ele.width((a4[0] * 1.33333) - 80);//.css('max-width', 'none');
                //ele.height((a4[1]) - 80);//.css('max-height', 'none');
                //ele.height(ele.height());//.css('max-height', 'none');
                //ele.css("min-height", (a4[1])+"px");//.css('max-height', 'none');
            }
            
            return html2canvas(ele,
            {
                imageTimeout: 9000,
                removeContainer: true
            });
        };

        getCanvas().then(function(canvas:HTMLCanvasElement)
        {
            {   //style back ui
                eCenter.css('overflow-y',cache_overflowy);
                if(setHeight)
                {
                    ele.width('auto');
                    ele.width('auto');
                }
                pdfbuttons.show();
            }

            //setTimeout for allowing the browser to repaint
            setTimeout(() => 
            {
                //image/jpeg -> black background
                var img = canvas.toDataURL("image/png", 1.0);
                var doc = new jsPDF(
                {
                    unit: 'px',
                    format: 'a4'
                });
                let hmax:number = a4[1] + 80;
                if(canvas.height > hmax)
                {
                    let imgs:Array<CanvasRenderingContext2D> = UJsUtil.splitImg(canvas, hmax);
                    for(let i:number=0;i<imgs.length;i++)
                    {
                        if(i > 0)doc.addPage();
                        doc.addImage(imgs[i].canvas.toDataURL("image/png", 1.0), 'PNG', 20, 20);
                    }
                }
                else
                {
                    doc.addImage(img, 'PNG', 20, 20);
                }
                doc.save(fn);
                $("html, body").css("cursor", "default");
            }, 1);
        });
    }
    public static splitImg(canvas:HTMLCanvasElement, pageHeight:number) : Array<CanvasRenderingContext2D>
    {
        let imgs:Array<CanvasRenderingContext2D> = new Array<CanvasRenderingContext2D>();
        let imgHeight:number = canvas.height;
        let imgStart:number = 0;

        var dx = 0;
        var dy = 0;
        var dWidth = canvas.width;
        var sx = 0;
        var sWidth = dWidth;

        while(true)
        {
            var dHeight = pageHeight;
            var sy = imgStart;
            var sHeight = imgStart + dHeight;
            if((sy + sHeight) > canvas.height)
            {
                dHeight = sHeight = canvas.height - sy;
                //console.log("LASTPAGEHEIGHT:"+sHeight+" = "+canvas.height+" - "+sy);
            }

            let c2:HTMLCanvasElement = document.createElement('canvas');
            c2.height = dHeight;
            c2.width = dWidth;
            let slice:CanvasRenderingContext2D = c2.getContext('2d');
            slice.drawImage(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            imgs.push(slice);

            imgStart = sy + sHeight;

            if(imgStart >= canvas.height)
            {
                break;
            }
            if(imgs.length > 9)
            {
                console.log("ERR: TOO BIG PDF? ");
                break;
            }
        }
        return imgs;
    }

    public static getAllChildren(e:Element, children:Array<Element>) : void
    {
        children.push(e);
        for(let i:number=0;i<e.children.length;i++)
        {
            UJsUtil.getAllChildren(e.children[i], children);
        }
    }

    public static isInChildren(nativeE:Element, to:any) : boolean
    {
        //let to:any = $event.toElement || $event.relatedTarget;
        let children:Array<Element> = new Array<Element>();
        UJsUtil.getAllChildren(nativeE, children);
        if (children.indexOf(to))
        {
            return true;
        }
        return false;
    }


    //TODO: untested function!
    public static isWithinElement(nativeE:Element, pointx:number, pointy:number, debug:boolean) : boolean
    {
        var e   = $(nativeE);
        var ex  = e.offset().left;   //retrieves the current position relative to the document
        var ey  = e.offset().top;
        var ewidth  = e.width();
        var eheight = e.height();

        //TODO: consider scrollpos.!?
        //var x = ($event.pageY - ex) + $(window).scrollTop();
        //var y = ($event.pageY - ey) + $(window).scrollTop();

        if(pointy < ey)
        {
            if(debug)console.log("isWithinElement mouse is above ele ex:"+ex+" ey:"+ey+" width:"+ewidth+" eheight:"+eheight+" mousey:"+pointy+" mousex:"+pointx);
            return false;
        }
        if(pointx < ex)
        {
            if(debug)console.log("isWithinElement mouse is left of ele ex:"+ex+" ey:"+ey+" width:"+ewidth+" eheight:"+eheight+" mousey:"+pointy+" mousex:"+pointx);
            return false;
        }
        if(pointy > ey+eheight)
        {
            if(debug)console.log("isWithinElement mouse is under ele ex:"+ex+" ey:"+ey+" width:"+ewidth+" eheight:"+eheight+" mousey:"+pointy+" mousex:"+pointx);
            return false;
        }
        if(pointx > ex+ewidth)
        {
            if(debug)console.log("isWithinElement mouse is rights of ele ex:"+ex+" ey:"+ey+" width:"+ewidth+" eheight:"+eheight+" mousey:"+pointy+" mousex:"+pointx);
            return false;
        }
        if(debug)console.log("isWithinElement mouse is WITHIN ele ex:"+ex+" ey:"+ey+" width:"+ewidth+" eheight:"+eheight+" mousey:"+pointy+" mousex:"+pointx);
        return true;
    }
}
