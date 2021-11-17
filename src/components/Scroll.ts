import { Component, OnClick, OnScroll } from "./Core";
import svg from "./svg";

export default class Scroll extends Component {
    render() {
        const scroll = new svg({className: "z-10 transition-transform ease-in-out duration-300 fixed bottom-0 right-0 h-12 w-12 rounded-full ring-2 m-4 bg-white shadow-md ring-opacity-50 cursor-pointer ring-gray-200"}, "M19 14l-7 7m0 0l-7-7m7 7V3"); 
        OnClick(scroll, (ev) => {
            if(window.scrollY <= document.body.scrollHeight/2) {
                window.scrollTo({behavior: "smooth", left: 0, top: document.body.scrollHeight});
            }
            else {
                window.scrollTo({behavior: "smooth", left: 0, top: 0});
            }
            const target = <HTMLElement>ev.target;
            // target.classList.add("rotate-180", "transition-transform", "ease-in-out", "duration-300")
        })

        OnScroll(scroll, (el) => {
            if(window.scrollY <= document.body.scrollHeight/2) {
                el.classList.remove("rotate-180")
            }
            else {
                el.classList.add("rotate-180")
            }
        })
        return scroll.render();
    }
}