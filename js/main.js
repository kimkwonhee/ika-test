
(() => {
    let yOffset = 0; //window.pageYoffset 대신 쓸 변수
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false;  //새로운 scene이 시작된 순간 true
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        // 0
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-0'),
                canvas : document.querySelector('#video-canvas-0'),
                context : document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages : []
            },
            values : {
                videoImageCount : 168,
                imageSequence : [0, 167],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
            }
        },
        // 1
        { 
            
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-1'),
                canvas : document.querySelector('#video-canvas-1'),
                context : document.querySelector('#video-canvas-1').getContext('2d'),
                messageA: document.querySelector('#scroll-section-1 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 212,
                imageSequence : [0, 211],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 2
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-2'),
                canvas : document.querySelector('#video-canvas-2'),
                context : document.querySelector('#video-canvas-2').getContext('2d'),
                messageA: document.querySelector('#scroll-section-2 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 154,
                imageSequence : [0, 153],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 3
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-3'),
                canvas : document.querySelector('#video-canvas-3'),
                context : document.querySelector('#video-canvas-3').getContext('2d'),
                messageA: document.querySelector('#scroll-section-3 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 210,
                imageSequence : [0, 209],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 4
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-4'),
                canvas : document.querySelector('#video-canvas-4'),
                context : document.querySelector('#video-canvas-4').getContext('2d'),
                messageA: document.querySelector('#scroll-section-4 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 153,
                imageSequence : [0, 152],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 5
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-5'),
                canvas : document.querySelector('#video-canvas-5'),
                context : document.querySelector('#video-canvas-5').getContext('2d'),
                messageA: document.querySelector('#scroll-section-5 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 157,
                imageSequence : [0, 156],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 6
        {
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-6'),
                canvas : document.querySelector('#video-canvas-6'),
                context : document.querySelector('#video-canvas-6').getContext('2d'),
                messageA: document.querySelector('#scroll-section-6 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 51,
                imageSequence : [0, 50],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 7
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-7'),
                canvas : document.querySelector('#video-canvas-7'),
                context : document.querySelector('#video-canvas-7').getContext('2d'),
                messageA: document.querySelector('#scroll-section-7 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 82,
                imageSequence : [0, 81],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 8
        {
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-8'),
                canvas : document.querySelector('#video-canvas-8'),
                context : document.querySelector('#video-canvas-8').getContext('2d'),
                messageA: document.querySelector('#scroll-section-8 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 73,
                imageSequence : [0, 72],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 9
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-9'),
                canvas : document.querySelector('#video-canvas-9'),
                context : document.querySelector('#video-canvas-9').getContext('2d'),
                messageA: document.querySelector('#scroll-section-9 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 40,
                imageSequence : [0, 39],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 10
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-10'),
                canvas : document.querySelector('#video-canvas-10'),
                context : document.querySelector('#video-canvas-10').getContext('2d'),
                messageA: document.querySelector('#scroll-section-10 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 50,
                imageSequence : [0, 49],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 11
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-11'),
                canvas : document.querySelector('#video-canvas-11'),
                context : document.querySelector('#video-canvas-11').getContext('2d'),
                messageA: document.querySelector('#scroll-section-11 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 35,
                imageSequence : [0, 34],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 12
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-12'),
                canvas : document.querySelector('#video-canvas-12'),
                context : document.querySelector('#video-canvas-12').getContext('2d'),
                messageA: document.querySelector('#scroll-section-12 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 109,
                imageSequence : [0, 108],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 13
        { 
            type : 'sticky',
            heightNum : 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-13'),
                canvas : document.querySelector('#video-canvas-13'),
                context : document.querySelector('#video-canvas-13').getContext('2d'),
                messageA: document.querySelector('#scroll-section-13 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 79,
                imageSequence : [0, 78],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 14
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-14'),
                canvas : document.querySelector('#video-canvas-14'),
                context : document.querySelector('#video-canvas-14').getContext('2d'),
                messageA: document.querySelector('#scroll-section-14 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 118,
                imageSequence : [0, 117],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 15
        { 
            type : 'sticky',
            heightNum : 4, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-15'),
                canvas : document.querySelector('#video-canvas-15'),
                context : document.querySelector('#video-canvas-15').getContext('2d'),
                messageA: document.querySelector('#scroll-section-15 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 118,
                imageSequence : [0, 117],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 16
        {
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-16'),
                canvas : document.querySelector('#video-canvas-16'),
                context : document.querySelector('#video-canvas-16').getContext('2d'),
                messageA: document.querySelector('#scroll-section-16 .main-message.a'),
                videoImages : []
            },
            values : {
                videoImageCount : 276,
                imageSequence : [0, 275],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
        // 17
        {
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs: {
                container : document.querySelector('#scroll-section-17'),
                canvas : document.querySelector('#video-canvas-17'),
                context : document.querySelector('#video-canvas-17').getContext('2d'),
                videoImages : []
            },
            values : {
                videoImageCount : 122,
                imageSequence : [0, 121],
                canvas_opacity : [1, 1, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.05, end: 0.10 }],
                messageA_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_in: [10, 0, { start: 0.05, end: 0.10 }],
                messageA_translateY_out: [0, -10, { start: 0.9, end: 0.95 }],
            }
        },
    ];


    function menuOpen() {
        let menu = document.getElementById('menu-section');
        let menubtn = document.getElementById('menu-btn');
        let closeSection = document.getElementById('close-btn-section');
        let closebtn = document.getElementById('close-btn');
        
        menubtn.onclick = () => { menu.style.width = 280 +'px'; 
                                  menubtn.style.display = 'none';
                                  closeSection.style.width = 280 +'px';};
        closebtn.onclick = () => {  menu.style.width = 0 +'px'; 
                                    menubtn.style.display = 'block'; 
                                    closeSection.style.width = 0 +'px';};
    }


    function setCanvasImages() {

        let imgElem;
        for (let j = 0; j < sceneInfo.length; j++) {
            for (let i = 1; i < sceneInfo[j].values.videoImageCount; i++) {
                let filenameNumber = i;
                let filename = '';
                if ( filenameNumber < 10) {
                    filename = '000' + filenameNumber;
                } else if ( filenameNumber < 100) {
                    filename = '00' + filenameNumber;
                } else if (filenameNumber >= 100 && filenameNumber < 1000) {
                    filename = '0' + filenameNumber;
                } else {
                    filename = String(filenameNumber);
                }
                imgElem = new Image();
                imgElem.src = `./video/ch${j}/img_${filename}.jpg`;
                sceneInfo[j].objs.videoImages.push(imgElem);
            // 24프레임
            }
        }

    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;    //각섹션 스크롤 총 높이 = hightnum * 뷰포트 높이
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight; 
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for ( let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if( totalScrollHeight >= yOffset ) {
                currentScene = i;   
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        // 캔버스에 사이즈 조정
        const heightRatio = window.innerHeight / window.innerHeight;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[1].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[3].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[4].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[5].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[6].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[7].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[8].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[9].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[10].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[11].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[12].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[13].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[14].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[15].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[16].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[17].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬 (스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        let scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv =(currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if ( currentYOffset < partScrollStart) {
                rv = values[0];
            } else if ( currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;  //섹션에 현재 yoffset 값 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset  / scrollHeight; 

        switch (currentScene) {
            case 0 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                break;
            case 1 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 2 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 3 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 4 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 5 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 6 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 7 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 8 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 9 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 10 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 11 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 12 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 13 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 14 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 15 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 16 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 17 : 
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (enterNewScene) return;

		playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

		if (!enterNewScene) {
			if (currentScene === 0 || currentScene === 1 || currentScene === 2 || currentScene === 3 || currentScene === 4
                || currentScene === 5 || currentScene === 6 || currentScene === 7 || currentScene === 8 || currentScene === 9
                || currentScene === 10 || currentScene === 11 || currentScene === 12 || currentScene === 13 || currentScene === 14
                || currentScene === 15 || currentScene === 16 || currentScene === 17) {
				const currentYOffset = delayedYOffset - prevScrollHeight;
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;
				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				if (objs.videoImages[sequence]) {
					objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				}
			}
		}

        // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
            sceneInfo[0].objs.canvas.style.opacity = 1;
            sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
            let tempYOffset = yOffset;
            scrollTo(0, tempYOffset - 1);
        }

		rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
    }   

    // 페이지 로드 됐을때
    // window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load', () => {
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
        // document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

         // 스크롤 했을때
        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
  			// checkMenu();

  			if (!rafState) {
  				rafId = requestAnimationFrame(loop);
  				rafState = true;
  			}            
  		});

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
              window.location.reload();
          }
        });

        window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});
        // document.querySelector('.loading').addEventListener('transitionend', (e) => {
        //     document.body.removeChild(e.currentTarget);
        // });
    });

    setCanvasImages();
    menuOpen();
})();
