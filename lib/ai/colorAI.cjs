"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var i=require("../core/Color.cjs"),c=require("../schemes/index.cjs");class l{constructor(u={}){this.apiKey=u.apiKey||"sk-37b7e5f545814da1923cae055b498c9a",this.apiUrl=u.apiUrl||"https://api.deepseek.com/v1/chat/completions",this.model=u.model||"deepseek-chat",this.defaultOptions={temperature:u.temperature||.7,maxTokens:u.maxTokens||500,language:u.language||"zh"}}async getSuggestions(u,e=3){const t=this.buildPrompt(u);try{const s=await this.callAPI(t),o=this.parseResponse(s),a=[];for(const r of o.slice(0,e)){const n=r.colors.map(d=>new i.Color(d)),p=c.ColorSchemeGenerator.generate(n[0],r.schemeType,{count:n.length});a.push({colors:n,scheme:p,description:r.description,reasoning:r.reasoning,tags:r.tags||[],confidence:r.confidence||.8})}return a}catch(s){return console.error("AI color suggestion failed:",s),this.getFallbackSuggestions(u,e)}}async analyzeColorScheme(u,e){const t=u.map(o=>o.toHex()),s=this.buildAnalysisPrompt(t,e);try{const o=await this.callAPI(s);return this.parseAnalysisResponse(o)}catch(o){return console.error("AI color analysis failed:",o),this.getLocalAnalysis(u)}}async getInspiration(u,e){const t=this.buildInspirationPrompt(u,e);try{const s=await this.callAPI(t),o=this.parseInspirationResponse(s);return{palette:o.colors.map(a=>new i.Color(a)),description:o.description,keywords:o.keywords}}catch(s){return console.error("AI inspiration failed:",s),this.getPresetInspiration(u)}}async callAPI(u){const e=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.apiKey}`},body:JSON.stringify({model:this.model,messages:[{role:"system",content:this.defaultOptions.language==="zh"?"\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u8272\u5F69\u8BBE\u8BA1\u5E08\uFF0C\u7CBE\u901A\u8272\u5F69\u7406\u8BBA\u3001\u8BBE\u8BA1\u5FC3\u7406\u5B66\u548C\u54C1\u724C\u8BBE\u8BA1\u3002\u8BF7\u57FA\u4E8E\u7528\u6237\u9700\u6C42\u63D0\u4F9B\u4E13\u4E1A\u7684\u914D\u8272\u5EFA\u8BAE\u3002":"You are a professional color designer with expertise in color theory, design psychology, and brand design. Please provide professional color suggestions based on user needs."},{role:"user",content:u}],temperature:this.defaultOptions.temperature,max_tokens:this.defaultOptions.maxTokens,response_format:{type:"json_object"}})});if(!e.ok)throw new Error(`API call failed: ${e.statusText}`);const t=await e.json();return JSON.parse(t.choices[0].message.content)}buildPrompt(u){return this.defaultOptions.language==="zh"?`
\u8BF7\u6839\u636E\u4EE5\u4E0B\u9700\u6C42\u751F\u6210\u914D\u8272\u65B9\u6848\uFF1A
- \u884C\u4E1A\uFF1A${u.industry||"\u901A\u7528"}
- \u60C5\u7EEA\uFF1A${u.mood?.join("\u3001")||"\u4E13\u4E1A\u3001\u73B0\u4EE3"}
- \u76EE\u6807\u7528\u6237\uFF1A${u.target||"\u5927\u4F17"}
- \u5B63\u8282\uFF1A${u.season||"\u56DB\u5B63\u901A\u7528"}
- \u98CE\u683C\uFF1A${u.style||"\u7B80\u7EA6"}
- \u504F\u597D\uFF1A${JSON.stringify(u.preferences||{})}

\u8BF7\u8FD4\u56DEJSON\u683C\u5F0F\uFF0C\u5305\u542B3\u4E2A\u914D\u8272\u65B9\u6848\uFF1A
{
  "suggestions": [
    {
      "colors": ["#hex1", "#hex2", "#hex3"],
      "schemeType": "monochromatic|analogous|complementary|triadic",
      "description": "\u65B9\u6848\u63CF\u8FF0",
      "reasoning": "\u9009\u62E9\u7406\u7531",
      "tags": ["\u6807\u7B7E1", "\u6807\u7B7E2"],
      "confidence": 0.9
    }
  ]
}
      `.trim():`
Generate color schemes based on:
- Industry: ${u.industry||"General"}
- Mood: ${u.mood?.join(", ")||"Professional, Modern"}
- Target: ${u.target||"General audience"}
- Season: ${u.season||"All seasons"}
- Style: ${u.style||"Minimalist"}
- Preferences: ${JSON.stringify(u.preferences||{})}

Return JSON with 3 color schemes:
{
  "suggestions": [
    {
      "colors": ["#hex1", "#hex2", "#hex3"],
      "schemeType": "monochromatic|analogous|complementary|triadic",
      "description": "Scheme description",
      "reasoning": "Reasoning",
      "tags": ["tag1", "tag2"],
      "confidence": 0.9
    }
  ]
}
      `.trim()}buildAnalysisPrompt(u,e){return this.defaultOptions.language==="zh"?`
\u5206\u6790\u4EE5\u4E0B\u914D\u8272\u65B9\u6848\uFF1A
\u989C\u8272\uFF1A${u.join(", ")}
${e?`\u5E94\u7528\u573A\u666F\uFF1A${JSON.stringify(e)}`:""}

\u8BF7\u8FD4\u56DEJSON\u683C\u5F0F\u7684\u5206\u6790\u7ED3\u679C\uFF1A
{
  "analysis": "\u6574\u4F53\u5206\u6790",
  "strengths": ["\u4F18\u70B91", "\u4F18\u70B92"],
  "weaknesses": ["\u7F3A\u70B91", "\u7F3A\u70B92"],
  "suggestions": ["\u5EFA\u8BAE1", "\u5EFA\u8BAE2"],
  "score": 85
}
      `.trim():`
Analyze this color scheme:
Colors: ${u.join(", ")}
${e?`Context: ${JSON.stringify(e)}`:""}

Return JSON analysis:
{
  "analysis": "Overall analysis",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "score": 85
}
      `.trim()}buildInspirationPrompt(u,e){return this.defaultOptions.language==="zh"?`
\u4E3A"${u}"\u751F\u6210\u914D\u8272\u7075\u611F${e?`\uFF0C\u98CE\u683C\uFF1A${e}`:""}\u3002

\u8FD4\u56DEJSON\u683C\u5F0F\uFF1A
{
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "description": "\u914D\u8272\u63CF\u8FF0\u548C\u7075\u611F\u6765\u6E90",
  "keywords": ["\u5173\u952E\u8BCD1", "\u5173\u952E\u8BCD2", "\u5173\u952E\u8BCD3"]
}
      `.trim():`
Generate color inspiration for "${u}"${e?`, style: ${e}`:""}.

Return JSON:
{
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "description": "Color description and inspiration",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
      `.trim()}parseResponse(u){return u.suggestions||[]}parseAnalysisResponse(u){return{analysis:u.analysis||"",strengths:u.strengths||[],weaknesses:u.weaknesses||[],suggestions:u.suggestions||[],score:u.score||70}}parseInspirationResponse(u){return{colors:u.colors||[],description:u.description||"",keywords:u.keywords||[]}}getFallbackSuggestions(u,e){const t=[];let s=210;u.mood?.includes("\u6D3B\u529B")&&(s=30),u.mood?.includes("\u81EA\u7136")&&(s=120),u.mood?.includes("\u4F18\u96C5")&&(s=270),u.preferences?.warm&&(s=20);for(let o=0;o<e;o++){const a=i.Color.fromHSL(s+o*30,70,50),r=["analogous","complementary","triadic"][o],n=c.ColorSchemeGenerator.generate(a,r,{count:5});t.push({colors:n.colors,scheme:n,description:`\u57FA\u4E8E${n.description}\u7684\u914D\u8272\u65B9\u6848`,reasoning:"\u6839\u636E\u60A8\u7684\u9700\u6C42\u81EA\u52A8\u751F\u6210",tags:u.mood||[],confidence:.6})}return t}getLocalAnalysis(u){const e=c.ColorSchemeGenerator.evaluateHarmony({type:"custom",base:u[0],colors:u,description:"Custom scheme"});return{analysis:`\u914D\u8272\u548C\u8C10\u5EA6\uFF1A${e}%`,strengths:e>70?["\u8272\u5F69\u548C\u8C10","\u89C6\u89C9\u8212\u9002"]:[],weaknesses:e<50?["\u8272\u5F69\u51B2\u7A81","\u7F3A\u4E4F\u7EDF\u4E00\u6027"]:[],suggestions:["\u8003\u8651\u4F7F\u7528\u66F4\u534F\u8C03\u7684\u8272\u5F69\u65B9\u6848"],score:e}}getPresetInspiration(u){const e={\u6D77\u6D0B:{palette:["#006994","#00A8E8","#00C9FF","#7EC8E3","#FFFFFF"].map(s=>new i.Color(s)),description:"\u6DF1\u9083\u7684\u6D77\u6D0B\u84DD\u914D\u5408\u6E05\u65B0\u7684\u5929\u7A7A\u84DD\uFF0C\u8425\u9020\u5B81\u9759\u81F4\u8FDC\u7684\u6C1B\u56F4",keywords:["\u5B81\u9759","\u6DF1\u9083","\u6E05\u65B0"]},\u68EE\u6797:{palette:["#2D5016","#3A7D44","#69B578","#95D5B2","#D5F2E3"].map(s=>new i.Color(s)),description:"\u4ECE\u6DF1\u7EFF\u5230\u6D45\u7EFF\u7684\u81EA\u7136\u6E10\u53D8\uFF0C\u5C55\u73B0\u751F\u673A\u52C3\u52C3\u7684\u68EE\u6797\u6C14\u606F",keywords:["\u81EA\u7136","\u751F\u673A","\u548C\u8C10"]},\u65E5\u843D:{palette:["#FF6B35","#F77825","#FFB700","#FFCB47","#FFE5AD"].map(s=>new i.Color(s)),description:"\u6E29\u6696\u7684\u6A59\u9EC4\u8272\u8C03\uFF0C\u6355\u6349\u5915\u9633\u897F\u4E0B\u7684\u7F8E\u597D\u77AC\u95F4",keywords:["\u6E29\u6696","\u6D6A\u6F2B","\u5E0C\u671B"]}},t={palette:c.ColorSchemeGenerator.generate(new i.Color("#3498db"),"analogous",{count:5}).colors,description:`\u57FA\u4E8E"${u}"\u7684\u914D\u8272\u7075\u611F`,keywords:[u,"\u521B\u610F","\u8BBE\u8BA1"]};return e[u]||t}}function g(F){return new l(F)}const h=new l;exports.ColorAI=l,exports.colorAI=h,exports.createColorAI=g;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=colorAI.cjs.map
