// comments.js
// Author:
//   3plus10i
//   ccl

class CommentSet {
	// 芦苇岛的文本导出格式
	pat_title_weed = /(?<id>\w{7}) \d{4}-\d{2}-\d{2}\([一|二|三|四|五|六|日]\)\d{2}:\d{2}:\d{2} No.(?<no>\d+)/;
	// PC网页的格式
    pat_title_pc = /20\d\d-\d\d-\d\d\([一|二|三|四|五|六|日]\)\d{2}:\d{2}:\d{2} ID:(?<id>\w{7})\s(?<po>\(PO主\))?.+No.(?<no>\d+)/;


	constructor(comments) {
		this.blackIdList = ['1pGvS00'];
		this.comments = comments.split('\n');
		this.ids = [];
		this.nos = [];

		this.headshot = null; // headshot:int 首个有效位为n时直接结束计点
		this.startn = 1; // startn:int 从n楼开始计算
		this.lastn = 1; // lastn:int 取倒数第n个位数
		this.silent = false; // silent:ToF 禁止向console输出
		this.blockpo = true; // blockpo:ToF 屏蔽po主的roll点

		// 方法必须写在成员后面
		this.parse();
		this.count_point();
	}

	parse() {
		// 从原始文本解析出id&no
		let matchResult, line;
		for (let i = 0; i < this.comments.length; i++) {
			line = this.comments[i];
			matchResult = line.match(this.pat_title_weed);
			if (matchResult != null) {
				this.ids.push(matchResult.groups['id']);
				this.nos.push(matchResult.groups['no']);
			}
		}
		// 当pat_title_weed匹配不到任何结果时，尝试PC模式
		if(this.ids.length==0){
			for (let i = 0; i < this.comments.length; i++) {
				line = this.comments[i];
				matchResult = line.match(this.pat_title_pc);
				if (matchResult != null) {
					this.ids.push(matchResult.groups['id']);
					this.nos.push(matchResult.groups['no']);
                    if(matchResult.groups['po'] && !this.blackIdList.includes(matchResult.groups['id'])){
						this.blackIdList.push(matchResult.groups['id'])
					}
				}

			}
		}
	}

	count_point() {
		// 计点

		let headshot = this.headshot;
		let startn = this.startn;
		let lastn = this.lastn;
		let silent = this.silent;
		let blockpo = this.blockpo;
		let blackIdList = blockpo ? this.blackIdList : [];

		const BLOCK = '已屏蔽';
		const DUPLICATED = '已roll';
		const SKIP = '不计入';
		const VALID = '有效  ';

		let report_list = [];
		let count = 0;
		let visited_ids = [];
		let summary = [];
		let head = 'id\t\t' + 'No\t\t\t' + 'status\t' + 'sum'
		for (let i = 0; i < this.ids.length; i++) {
			let id = this.ids[i];
			let no = this.nos[i];
			if (blackIdList.includes(id)) {
				report_list.push([id, no, BLOCK, String(count)]);
				continue;
			}
			if (startn > 1) {
				startn -= 1;
				report_list.push([id, no, SKIP, String(count)]);
				continue;
			}
			if (visited_ids.includes(id)) {
				report_list.push([id, no, DUPLICATED, String(count)]);
			}
			else {
				visited_ids.push(id);
				count += Number(no[no.length - lastn]);
				summary.push(no[no.length - lastn]);
				report_list.push([id, no, VALID, String(count)]);
				if (headshot != null & count == headshot) {
					summary = 'headshot!';
					break;
				}
				headshot = null;
			}
		}
		count = String(count);
		count = count[count.length - 1];

		// 所有有效点数5个一组分开
		let summary_ = [];
		let i = 0;
		while (i + 4 < summary.length) {
			summary_.push(summary.slice(i, i + 5).join(''));
			i += 5;
		}
		summary_.push(summary.slice(i, summary.length).join(''));
		summary = summary_.join(' ');

		// 报告
		let report = '';
		let abstract = '';
		report = report + summary + '\n';
		report = report + '目前点数：' + count + '\n';
		abstract = report;
		report = report + '=====以下为详细报告=====' + '\n';
		report = report + head + '\n';

		for (i in report_list) {
			report = report + report_list[i].join('\t') + '\n';
		}
		if (!silent) {
			console.log(report);
		}
		return {"simple": abstract, "report": report};  //TODO 建议ccl修改这里的simple为abstract，或修改"report"为"verbose"
	}

}
exports.CommentSet = CommentSet;


// for test
/*
let comments_weed;
comments_weed = "9WwvRSO 2021-02-22(一)18:40:45 No.35228067\n孔特拉当场GG\nHtMuRaV 2021-02-22(一)18:41:51 No.35228105\n孔德拉死了啦\nr\nPl8tFqa 2021-02-22(一)18:43:15 No.35228158\n控9然后用冻拳揍，r";

let comment_pc;
comment_pc = "…	\n无标题 无名氏 2021-02-24(三)00:37:53 ID:SPSiyKY (PO主) [举报] No.35272232\n>>No.35272180\n步行吧。\n\n走哪条路?\n\n1-3 走最快的偏僻小道。\n\n//一尾\n…	\n无标题 无名氏 2021-02-24(三)00:38:22 ID:x111Edg [举报] No.35272243\nr\n…	\n无标题 无名氏 2021-02-24(三)00:38:33 ID:Q627MjK [举报] No.35272248\n取第一个回复所以大家不太敢发吧>>No.35272179\n…	\n无标题 无名氏 2021-02-24(三)00:38:50 ID:6G4W9wD [举报] No.35272261\n走哪条路都有风险( ﾟ∀。)\n\n…\n无标题 无名氏 2021-02-24(三)10:21:34 ID:SPSiyKY (PO主) [举报] No.35279060\n>>No.35278962";

// let cs = new CommentSet(comments_weed)
let cs = new CommentSet(comment_pc)
cs.comments[0]
let report = cs.count_point()
let a = 1

//*/