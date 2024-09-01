export const addSpanOnHyphen = (
  value,
) => {
  if (typeof value == 'string') {
    return value.replaceAll(" - ", "<span class='letter-space-hypen'> - </span>").replaceAll(" – ", "<span class='letter-space-hypen'> – </span>")
  }
  return value
};

export const displayDesc = (desc: string, intervention = false) => {
  if (desc && typeof desc == 'string') {
    const list = desc.split('|');
    let ul = '<ul style="list-style-type: none; padding-left:0; margin-bottom: 0;">'
    list.forEach((l) => {
      const isGroup = l.indexOf(';');
      if (isGroup > -1) {
        const group = l.split(';');
        const subTask = group[1] == "" ? "" : `${group[1]}.`
        let desc;
        if ((!intervention && group.length == 3) || (intervention && group.length == 4)) {
          desc = group[2] ?? ""
        } else if (!intervention && group.length > 3) {
          desc = group.splice(2, group.length - 1).join(";")
        } else if (intervention && group.length > 4) {
          desc = group.splice(2, group.length - 2).join(";")
        }
        ul += `<li>${subTask} ${desc ?? ""}</li>`;
      } else {
        ul += `<li>${l}</li>`;
      }
    });
    ul += '</ul>';
    if (intervention) {
      if (desc.includes(";0")) {
        desc = desc.replace(";0", "")
      }
    }
    return addSpanOnHyphen(ul)
  }
  return desc
}

export const displayTaskNoCBM = (taskNo: string) => {
  if (isNaN(Number(taskNo))) {
    let stringIndex = ''
    let continueLoop = true
    for (let i = 0; i < taskNo.length; i++) {
      if (continueLoop) {
        if (isNaN(Number(taskNo.charAt(i)))) {
          stringIndex = taskNo.charAt(i)
          continueLoop = false
        }
      }
    }
    const taskNumb = taskNo.split(stringIndex)[0]
    return taskNumb
    // return taskNo.replace(/[a-zA-Z_]+/g, '')
  }
  return taskNo
}

export const displayDescCBM = (desc: string, taskNo: string) => {
  if (typeof desc == 'string') {
    const list = desc.split('|');
    let ul = '<ul style="list-style-type: none; padding-left:0; margin-bottom: 0;">'
    list.forEach((l) => {
      let taskNumb = ''
      let stringIndex = 0
      if (isNaN(Number(taskNo))) {
        let continueLoop = true
        for (let i = 0; i < taskNo.length; i++) {
          if (continueLoop) {
            if (isNaN(Number(taskNo.charAt(i)))) {
              stringIndex = i
              continueLoop = false
            }
          }
        }
        taskNumb = taskNo.substring(stringIndex)
      }
      // const match = taskNo.match(/[a-zA-Z]+/g)
      if (taskNumb) {
        if ((taskNumb.replace(/[^a-z]/gi, "").length) > 1) {
          ul += `<li>${l}</li>`;
        } else {
          ul += `<li>${taskNumb}. ${l}</li>`;
        }
      } else {
        ul += `<li>${l}</li>`;
      }
    });
    ul += '</ul>';
    return addSpanOnHyphen(ul)
  }
  return desc
}

export const manualWordWrap = (string, length) => {
  const stringList: string[] = []
  if (!string) {
    return ""
  }
  for (let i = 0; i < string.length; i += length) {
    const stringSlice = string.substring(i, i + length);
    stringList.push(stringSlice);
  }
  return stringList.join("<br />")
}

export const addSpanOnTagB = (val) => {
  if (typeof val == 'string') {
    const changeBTag = val.replaceAll('<b>', '<span style="font-weight: 700; margin-right: 3px;">');
    const changeStrongTag = changeBTag.replaceAll('<strong>', '<span style="font-weight: 700; margin-right: 3px;">');
    const changeCloseStrongTag = changeStrongTag.replaceAll('</strong>', '</span>');
    const finalString = changeCloseStrongTag.replaceAll('</b>', '</span>');
    return finalString;
  } else {
    return val
  }
}

export const changeSymbolToUnicode = (val) => {
  if (typeof val == 'string') {
    const changeDot = val.replaceAll('●', '&bull;');
    return changeDot;
  } else {
    return val
  }
}

export const formatHtml = (stringHtml: string) => {
  const addSpanHyphen = addSpanOnHyphen(stringHtml);
  const makeBold = addSpanOnTagB(addSpanHyphen);
  const finalString = changeSymbolToUnicode(makeBold);
  return finalString
}

export const escapePunctuation = (string: string) => {
  return string.replaceAll(".", "")
}
