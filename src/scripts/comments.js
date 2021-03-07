// comments.js
// Author:
//   3plus10i
//   ccl

export {
	CommentSet
}

class CommentSet {
	pat_title_weed = /(?<id>\w{7}) \d{4}-\d{2}-\d{2}\([一|二|三|四|五|六|日]\)\d{2}:\d{2}:\d{2} No.(?<no>\d+)/;

	constructor(comments) {
		this.blackIdList = this.blackIdList = ['1pGvS00'];
		this.comments = comments.split('\n');
		this.ids = [];
		this.nos = [];
		this.parse();
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
	}

	count_point(headshot = null, startn = 1, lastn = 1, silent = false) {
		// 计点
		// headshot:int 首个有效位为n时直接结束计点
		// startn:int 从n楼开始计算
		// lastn:int 取倒数第n个位数

		const BLOCK = '已屏蔽';
		const DUPLICATED = '已roll';
		const SKIP = '不计入';
		const VALID = '有效  ';

		let report = [];
		let count = 0;
		let visited_ids = [];
		let summary = [];
		let head = 'id\t\t' + 'No\t\t\t' + 'status\t' + 'sum'
		for (let i = 0; i < this.ids.length; i++) {
			let id = this.ids[i];
			let no = this.nos[i];
			if (this.blackIdList.includes(id)) {
				report.push([id, no, BLOCK, String(count)]);
				continue;
			}
			if (startn > 1) {
				startn -= 1;
				report.push([id, no, SKIP, String(count)]);
				continue;
			}
			if (visited_ids.includes(id)) {
				report.push([id, no, DUPLICATED, String(count)]);
			}
			else {
				visited_ids.push(id);
				count += Number(no[no.length - lastn]);
				summary.push(no[no.length - lastn]);
				report.push([id, no, VALID, String(count)]);
				if (headshot != null & count == headshot) {
					summary = 'headshot!';
					break;
				}
				headshot = null;
			}
		}
		count = String(count);
		count = count[count.length - 1];

		// 5个一组分开
		let summary_ = [];
		let i = 0;
		while (i + 4 < summary.length) {
			summary_.push(summary.slice(i, i + 5).join(''));
			i += 5;
		}
		summary_.push(summary.slice(i, summary.length).join(''));

		// 报告
		let report_txt = '';
		let simpleReport_txt = ''
		report_txt = report_txt + summary_.join(' ') + '\n';
		report_txt = report_txt + '目前点数：' + count + '\n';
		simpleReport_txt = report_txt;
		report_txt = report_txt + '=======以下为详细报告=======' + '\n';
		report_txt = report_txt + head + '\n';

		for (i in report) {
			report_txt = report_txt + report[i].join('\t') + '\n';
		}
		if (!silent) {
			console.log(report_txt);
		}
		return {"simple": simpleReport_txt, "report": report_txt};
	}

}


// let comments
// comments = "9WwvRSO 2021-02-22(一)18:40:45 No.35228067\n孔特拉当场GG\nHtMuRaV 2021-02-22(一)18:41:51 No.35228105\n孔德拉死了啦\nr\nPl8tFqa 2021-02-22(一)18:43:15 No.35228158\n控9然后用冻拳揍tm的，r";

// let cs = new CommentSet(comments)
// cs.comments[0]
// let report_txt = cs.count_point()

