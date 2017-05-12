(function() {
	var code = function(){
		window.suspicious_elements = [];
		var addToSuspicious = (node) => window.suspicious_elements.indexOf(node) < 0 && window.suspicious_elements.push(node);
		var highlight = (e,s) => (s=e.style,s.border="1px solid red",s.backgroundColor="yellow",s.fontWeight="bolder",s.color="black",e);
		var check_http = v => v.match(/^http:/i);

		var checkmap = {
			a : {
				href : check_http
			},
			form : {
				action : check_http
			}
		}
		var tags = Object.keys(checkmap);

		var check = (nodes) => nodes.filter(x=>tags.indexOf(x.tagName.toLowerCase())>=0).filter((x,t)=>(t=x.tagName.toLowerCase(),Object.keys(checkmap[t]).filter(h=>x.hasAttribute(h)).some(k=>checkmap[t][k](x.getAttribute(k))))).map(highlight).map(addToSuspicious);

		var whatToObserve = {childList: true, attributes: true, subtree: true, attributeOldValue: false, attributeFilter: ['href', 'action']};
		var mutationObserver = new MutationObserver(function(mutationRecords) {
			mutationRecords.map(function(mutationRecord) {
				if (mutationRecord.type === 'childList') {
					[].map.call(mutationRecord.addedNodes,function(node){
						if(node.tagName){
							check([node]);
							check([].slice.call(node.querySelectorAll('a,form')));
						}
					})
				}else if (mutationRecord.type === 'attributes') {
					check([mutationRecord.target]);
				}
			});
		});
		mutationObserver.observe(document.documentElement, whatToObserve);
	};
	var s = document.createElement('script');
	s.textContent = "eval('('+atob('"+btoa(code.toString())+"')+')()');document.currentScript.parentNode.removeChild(document.currentScript);";
	(document.head || document.documentElement).appendChild(s);
})()