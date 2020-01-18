export default class StringUtil {

	public constructor() {
	}

	public static isNullOrEmpty(input: string): boolean {
		return input == null || input.length == 0;
	}

	public static split2IntegerArray(input: string, delim: string = ","): number[] {
		let result: number[] = [];
		if (StringUtil.isNullOrEmpty(input)) {
			return result;
		}
		let values: string[] = input.split(delim);
		for (let item of values) {
			result.push(parseInt(item));
		}
		return result;
	}

	public static replaceAll(input: string, regex: string, replacement: string): string {
		if (StringUtil.isNullOrEmpty(input)) {
			return "";
		}
		return input.split(regex).join(replacement);
	}

	/**
	  * 去掉字符串前后空格
	  * @author ligenhao
	  * @static
	  * @param {string} input 
	  * @returns {string} 
	  * @memberof StringUtil
	  */
	public static trim(input: string): string {
		return input.replace(/(^\s*)|(\s*$)/g, "");
	}

	private static readonly C_A: number = 65;
	private static readonly C_Z: number = 90;
	private static readonly C_a: number = 97;
	private static readonly C_z: number = 98;
	/**
	  * 把字母字符串解析为整型数组（小写字母代表负数，大写字母代表正数，0还是0，如"a0A"->[-1, 0, 1]）
	  * @author ligenhao
	  * @static
	  * @param {string} input 
	  * @returns {number[]} 
	  * @memberof StringUtil
	  */
	public static parseLetters(input: string): number[] {
		let result: number[] = [];
		if (StringUtil.isNullOrEmpty(input)) {
			return result;
		}
		for (let i = 0; i < input.length; i++) {
			let code: number = input.charCodeAt(i);
			if (code >= StringUtil.C_A && code <= StringUtil.C_Z) {//大写字母
				result.push(code - StringUtil.C_A + 1);
			} else if (code >= StringUtil.C_a && code <= StringUtil.C_z) {//小写字母
				result.push(-(code - StringUtil.C_a + 1));
			} else {
				result.push(0);
			}
		}
		return result;
	}

	/**
	 * 把数字转换为加密字母
	 * @author ligenhao
	 * @static
	 * @param {number} num 
	 * @returns {string} 
	 * @memberof StringUtil
	 */
	public static toLetter(num: number): string {
		if (num > 0) {
			return String.fromCharCode(StringUtil.C_A + num - 1);
		} else if (num < 0) {
			return String.fromCharCode(StringUtil.C_a - num - 1);
		}
		return "0";
	}

	/**
	  * 格式化字符串
	  * @author ligenhao
	  * @static
	  * @param {string} input 
	  * @param {any} args 
	  * @returns {string} 
	  * @memberof StringUtil
	  */
	public static format(input: string, ...args): string {
		for (let value of args) {
			if (typeof value === "string") {
				input = input.replace("%s", value);
			} else if (typeof value === "number") {
				if (String(value).indexOf(".") != -1) {
					input = input.replace("%f", String(value));
				} else {
					input = input.replace("%d", String(value));
				}
			}
		}
		return input;
	}

	private static readonly OPERATORS: string[] = ["*", "/", "+", "-"];
	private static readonly BRACKETS: string[] = ["(", ")"];
	private static computeStringWithoutBracket(noBracketString: string): number {
		var numsStack: number[] = [];
		var operatorsStack: string[] = [];
		if (noBracketString.charAt(0) != "-") {
			noBracketString = "+" + noBracketString;
		}
		var operatorIndexs: number[] = [];
		for (var i = 0; i < noBracketString.length; i++) {
			var char = noBracketString.charAt(i);
			if (StringUtil.OPERATORS.indexOf(char) != -1) {
				operatorIndexs.push(i);
				operatorsStack.push(char);
			}
		}
		var numChar;
		for (var j = 1; j < operatorIndexs.length; j++) {
			numChar = noBracketString.substring(operatorIndexs[j - 1] + 1, operatorIndexs[j]);
			numsStack.push(parseFloat(numChar));
		}
		numChar = noBracketString.substring(operatorIndexs[operatorIndexs.length - 1] + 1);
		numsStack.push(parseFloat(numChar));
		if (operatorsStack[0] == "-") {
			numsStack[0] = -numsStack[0];
		}
		operatorsStack.shift();
		var multiplyIdx = operatorsStack.indexOf("*");
		var divisionIdx = operatorsStack.indexOf("/");
		while (multiplyIdx != -1 || divisionIdx != -1) {
			if (multiplyIdx != -1 && divisionIdx != -1) {
				if (multiplyIdx < divisionIdx) {
					this.doCalculate(numsStack, operatorsStack, multiplyIdx);
					divisionIdx = operatorsStack.indexOf("/");
					this.doCalculate(numsStack, operatorsStack, divisionIdx);

				}
				else {
					this.doCalculate(numsStack, operatorsStack, divisionIdx);
					multiplyIdx = operatorsStack.indexOf("*");
					this.doCalculate(numsStack, operatorsStack, multiplyIdx);
				}
			}
			else if (multiplyIdx != -1) {
				this.doCalculate(numsStack, operatorsStack, multiplyIdx);
			}
			else {
				this.doCalculate(numsStack, operatorsStack, divisionIdx);
			}
			multiplyIdx = operatorsStack.indexOf("*");
			divisionIdx = operatorsStack.indexOf("/");
		}
		var addIdx = operatorsStack.indexOf("+");
		var minusIdx = operatorsStack.indexOf("-");
		while (addIdx != -1 || minusIdx != -1) {
			if (addIdx != -1 && minusIdx != -1) {
				if (addIdx < minusIdx) {
					this.doCalculate(numsStack, operatorsStack, addIdx);
					minusIdx = operatorsStack.indexOf("-");
					this.doCalculate(numsStack, operatorsStack, minusIdx);

				}
				else {
					this.doCalculate(numsStack, operatorsStack, minusIdx);
					addIdx = operatorsStack.indexOf("+");
					this.doCalculate(numsStack, operatorsStack, addIdx);
				}
			}
			else if (addIdx != -1) {
				this.doCalculate(numsStack, operatorsStack, addIdx);
			}
			else {
				this.doCalculate(numsStack, operatorsStack, minusIdx);
			}
			addIdx = operatorsStack.indexOf("+");
			minusIdx = operatorsStack.indexOf("-");
		}
		return numsStack[0];
	}

	private static doCalculate(numsStack: number[], operatorsStack: string[], operatorIdx: number): void {
		var leftNum: number;
		var rightNum: number;
		var result: number;
		leftNum = numsStack.splice(operatorIdx, 1)[0];
		rightNum = numsStack.splice(operatorIdx, 1)[0];

		var operator = operatorsStack.splice(operatorIdx, 1)[0];
		switch (operator) {
			case "*":
				{
					result = leftNum * rightNum;
					break;
				}
			case "/":
				{
					result = leftNum / rightNum;
					break;
				}
			case "+":
				{
					result = leftNum + rightNum;
					break;
				}
			case "-":
				{
					result = leftNum - rightNum;
					break;
				}
		}
		numsStack.splice(operatorIdx, 0, result);
	}

	private static getNextBraketsIndex(input: string): any[] {
		var leftBracketAndRightBracketIndexs: any[] = [];
		var tmpIndexs: number[] = [];
		for (var i = 0; i < input.length; i++) {
			var char = input.charAt(i);
			if (char == "(") {
				tmpIndexs.push(i);
			}
			else if (char == ")") {
				leftBracketAndRightBracketIndexs.push([tmpIndexs.pop(), i]);
				break;
			}
		}
		return leftBracketAndRightBracketIndexs;
	}

	/**
	  * calculate the input string like "((1-4)*4-2/5)*10" and return a number
	  */
	public static computeString(input: string): number {
		var regexCheck: RegExp = new RegExp("[\\(\\)\\d\\+\\-\\*/\\.]*"); // 是否是合法的表达式  
		if (input.match(regexCheck).length <= 0) {
			return 0;
		}
		var leftBracketAndRightBracketIndexs: any[] = [];
		leftBracketAndRightBracketIndexs = this.getNextBraketsIndex(input);
		var findLeftBracketIndex: number;
		var findRightBracketIndex: number;
		while (leftBracketAndRightBracketIndexs.length > 0) {
			var brackets: any[] = leftBracketAndRightBracketIndexs.shift();
			findLeftBracketIndex = brackets[0];
			findRightBracketIndex = brackets[1];
			var noBracketStr: string = input.substring(findLeftBracketIndex + 1, findRightBracketIndex);
			var tmpValue = this.computeStringWithoutBracket(noBracketStr);
			var leftRemainStr: string = input.substring(0, findLeftBracketIndex);
			var rightRemainStr: string = input.substring(findRightBracketIndex + 1);
			input = leftRemainStr + tmpValue + rightRemainStr;
			leftBracketAndRightBracketIndexs = this.getNextBraketsIndex(input);
		}
		return this.computeStringWithoutBracket(input);
	}

    public static toInt(s: string, radix?: number):number
    {
        if(StringUtil.isNullOrEmpty(s)){
            return 0;
        }
        return parseInt(s, radix);
    }
}