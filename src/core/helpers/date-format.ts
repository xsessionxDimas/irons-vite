import moment, {
  DurationInputArg1,
  DurationInputArg2,
  Moment
} from "moment";

// example = 18-Jan-2022
export const simpleFormatDate = (input: string): string => {
  return input ? moment(input).format("DD-MMM-YYYY") : "";
};

// example = 18-Jan-22
export const simpleFormatDateShort = (input: string): string => {
  return input ? moment(input).format("DD-MMM-YY") : "";
};
export const simpleFormatDateShortAU = (input: string): string => {
  return input ? moment(input).format("DD.MM.YYYY") : "";
};

// example = 18 Jan 2022
export const simpleFormatDateWoHiven = (input: string): string => {
  return input ? moment(input).format("DD MMM YYYY") : "";
};

// example = 20-10-2021 09:38:19
export const formatDateTime = (input: string) => {
  if (input) {
    return moment(input).local().format("DD-MM-YYYY hh:mm:ss");
  } else {
    return "";
  }
};

// example = 26 Mar 2022 17:38
export const formatUTCtoLocalDateTimeTwentyFourHours = (input: string) => {
  if (input) {
    return moment.utc(input).local().format("DD MMM YYYY, HH:mm");
  } else {
    return "";
  }
};

// example = 2022-12-20
export const formatInternationalDate = (input = "") => {
  if (input) {
    return moment(input).format("YYYY-MM-DD");
  } else {
    return moment(new Date()).format("YYYY-MM-DD");
  }
};

// example = Feb 08,2022 11:16 AM from UTC "2022-02-08T04:16:13.3333333"
export const formatUTCtoLocalDateTimeMeridiem = (input: string) => {
  if (input) {
    return moment.utc(input).local().format("MMM DD,YYYY hh:mm A");
  } else {
    return "";
  }
};

// example = 22/02/2022 09:46 AM
export const formatSlashDateTimeMeridiem = (input: string) => {
  if (input) {
    return moment(input).format("DD/MM/YYYY hh:mm A");
  } else {
    return "";
  }
};

// example = 22/02/2022
export const formatSlashDate = (input: string) => {
  if (input) {
    return moment(input).format("DD/MM/YYYY");
  } else {
    return "";
  }
};

// example = 02/22/2022
export const formatInternationalSlashDate = (input: string) => {
  if (input) {
    return moment(input).format("MM/DD/YYYY");
  } else {
    return "";
  }
};

// example = 24:00 to UTC
export const formattime24 = (input: string) => {
  if (input) {
    return moment.utc(input).local().format("HH:mm");
  } else {
    return "";
  }
};

// example = 24:00
export const formatDateString = (input: string) => {
  if (input) {
    return moment(input).format("MMMM DD, YYYY");
  } else {
    return "";
  }
};

export const formatDate = (input: string, format: string): string => {
  return input ? moment(input).format(format) : "";
};

export const formatDateAU = (input: string): string => {
  return input ? moment.utc(input).local().format("DD.MM.YYYY HH:mm:ss") : "";
};

export const formatDateAUCurrent = (): string => {
  return moment.utc().local().format("DD.MM.YYYY HH:mm:ss");
};

export const newFormatDateAUCurrent = (): string => {
  return moment.utc().local().format("DD/MM/YY HH:mm:ss");
};

export const newDateAUCurrent = (input: string | null = null): string => {
  return input ? moment.utc(input).local().format("DD/MM/YYYY") : moment.utc().local().format("DD/MM/YYYY");
};

export const AESTShortCurrentDateTime = (): string => {
  return `${moment.utc().utcOffset(10).format("DD/MM/YY HH:mm:ss")}`
}

export const AESTCurrentDateTime = (): string => {
  return `${AESTShortCurrentDateTime()} (AEST)`
}

export const AESTDateTime = (date): string => {
  return `${moment.utc(date).utcOffset(10).format("DD/MM/YY HH:mm:ss")} (AEST)`
}

export const AESTCurrentTimestamp = (): number => {
  return moment.utc().utcOffset(10).unix()
}

export const dayNightConverter = (offset): string => {
  return moment().utc().utcOffset(offset).hours() <= 18 ? "Day Shift" : "Night Shift";
}

export const formatDateOnlyAU = (input: string): string => {
  return input ? moment.utc(input).local().format("DD.MM.YYYY") : "";
};

export const formatDateMonitoring = (input: string): string => {
  return input ? moment.utc(input).format("DD.MM.YYYY") : "";
};

export const calculateDateOverdue = (input: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leftOver = (new Date(input) as any) - (new Date() as any);
  const overdue = Math.round(Math.floor(leftOver) / (1000 * 60 * 60 * 24));
  if (overdue < 0) {
    return "";
  }
  return overdue;
};

export const isValidDate = (input: string) => {
  return moment(input, moment.ISO_8601, true).isValid();
};

export const dateToUTC = (input: Date) => {
  return Date.UTC(
    input.getUTCFullYear(),
    input.getUTCMonth(),
    input.getUTCDate(),
    input.getUTCHours(),
    input.getUTCMinutes(),
    input.getUTCSeconds(),
  );
};

// 04/14/2022, 12:00:00 AM
export const datetimeformatBE = (input) => {
  return moment(input).format("MM/DD/YYYY, hh:mm:ss A");
};

// 11 Mar 2022 19:35:40
export const dpaDateTimeFormat = (input) => {
  if (input) {
    return moment(input).format("DD MMM YYYY HH:mm:ss");
  } else {
    return "";
  }
}

export const formatDateTimeUTC = (input) => {
  if (
    moment(input).format("DD MMM YYYY") === "01 Jan 1900" ||
    moment(input).format("DD MMM YYYY") === "01 Jan 0001"
  ) {
    return "";
  }
  return moment.utc(input).local().format("DD MMM YYYY HH:mm:ss");
};

export const formatDateUTC = (input) => {
  if (
    moment(input).format("DD MMM YYYY") === "01 Jan 1900" ||
    moment(input).format("DD MMM YYYY") === "01 Jan 0001"
  ) {
    return "";
  }
  return moment.utc(input).local().format("DD MMM YYYY");
};

export const formatDateForPostData = (input: string) => {
  if (input) {
    return `${moment(input).local().format("YYYY-MM-DD")}T00:00:00`
  } else {
    return ""
  }
}

// "MM/DD/YYYY"
export const normalizeDate = (inputDate: Date) => {
  const date = (inputDate.getDate()).toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  const year = inputDate.getFullYear();

  return `${month}/${date}/${year}`;
}

export const formatDateAUToRegularDate = (inputDate: string) => {
  const dateString = inputDate.replaceAll(".", "/"); // dd.mm.yyyy to dd/mm/yyyy
  const dateMomentObject = moment(dateString, "DD/MM/YYYY HH:mm:ss"); // 1st argument - string, 2nd argument - format

  return dateMomentObject.toDate();
}

// ===================== DMA =====================
export const formateDateUpdatedByEForm = (input: string) => {
  if (input) {
    return moment.utc(input).local().format("DD.MM.YYYY HH:mm:ss")
  } else {
    return ""
  }
}
// ===================== DMA =====================

export const handleConvertTo24Hrs = (time) => {
  return `${Number(time.split(':')[0]) + 12}:${time.split(':')[1]}:${time.split(':')[2]}`
}

export const getUTCOffsetTime = (offset) => {
  return moment().utc().utcOffset(offset).format('HH:mm:ss')
}

export const getUTCOffsetDate = (offset) => {
  const date = moment().utcOffset(offset)
  return date.format("DD/MM/YYYY HH:mm:ss")
}
// example = 2022-06-15
/**
 *
 * @param input date ex:13/04/2023
 * @param inputFormat ex: 'DD/MM/YYYY'
 * @param outputFormat ex: "YYYY-MM-DD"
 * @returns ex: 2023-04-13
 */
export const simpleFormatIntShort = (input: string, inputFormat: string, outputFormat: string): string => {
  return input ? moment(input, inputFormat).format(outputFormat) : "";
};

export const dynamicDateFormatter = (date: string, initialDateFormat: string, expectedDateFormat: string) => {
  return moment(date, initialDateFormat).format(expectedDateFormat)
}

export const substractDateByDurationHelper = (currentDate: Date, substractDate: string) => {
  return moment(currentDate).subtract(moment.duration(substractDate))
}

export const formatDateWithUtcOffsetHelper = (timeZone: string, expectedFormat: string) => {
  return moment().utcOffset(timeZone).format(expectedFormat)
}

// addParam etc "days", "months"
export const addDateByDynamicParamHelper = (currentDate: string, initialDateFormat: string, addDate, addParam: string) => {
  return moment(currentDate, initialDateFormat).add(addDate, addParam)
}

export const compareDatesIsSameOrBeforeHelper = (firstDate: Date, comparationDate: moment.Moment) => {
  return moment(firstDate).isSameOrBefore(comparationDate)
}

export const compareDiffDatesHelper = (firstDate: Date, secondDate: Date) => {
  return moment(firstDate).diff(moment(secondDate))
}

export const formatUnixDateHelper = (unixDate: number, format: string) => {
  return moment.unix(unixDate).format(format)
}

export const formatDateHelper = (Date: string, format: string) => {
  return moment(Date).format(format)
}

export const substractCurrentDateWithFormatHelper = (duration: number, substractDate: string, format: string) => {
  return moment().subtract(duration, (substractDate as moment.unitOfTime.DurationConstructor)).format(format)
}

export const addCurrentDateWithFormatHelper = (duration: number, addDate: string, format: string) => {
  return moment().add(duration, (addDate as moment.unitOfTime.DurationConstructor)).format(format)
}

export const formatCurrentDateHelper = (format: string) => {
  return moment().format(format)
}

export const getLastMonthFirstDayDateHelper = () => {
  return moment().subtract(1, "months").startOf("month")
}

export const getcurrentMonthLastDayDateHelper = (startDate) => {
  return moment(startDate).endOf("month")
}

export const substractDynamicDateHelper = (date: Date, format: string, duration: number, substractDate: string) => {
  return moment(date, format).subtract(duration, substractDate as moment.unitOfTime.DurationConstructor)
}

export const addDynamicDateHelper = (date: Date, format: string, duration: number, addDate: string) => {
  return moment(date, format).add(duration, addDate as moment.unitOfTime.DurationConstructor)
}

export const momentFormat = (date: Date | string) => {
  return moment(date)
}

export const epoctToDateUTC = (epochTime: number) => {
  const date = new Date(0)
  date.setUTCSeconds(epochTime)
  return date
}

export const diffMinutes = (date1: Date, date2: Date) => {
  const d1 = date1.getTime();
  const d2 = date2.getTime();
  return Math.round((d2 - d1) / 60000); // Can use Math.floor or Math.ceil depends up to you
}

export const removeAEST = (inputString: string) => {
  return inputString.replace(/\(AEST\)/g, "").trim();
}

export const isBefore = (date1?: string | Moment, date2?: string | Moment) => {
  const date1Object = typeof date1 === 'string' ? moment(date1) : date1 || moment();
  const date2Object = typeof date2 === 'string' ? moment(date2) : date2 || moment();
  return date1Object.isBefore(date2Object);
}

export const add = (date: string | undefined = undefined, duration: DurationInputArg1, unit: DurationInputArg2, format: string | undefined = undefined) => {
  const finalDate = moment(date, format).add(duration, unit);
  return finalDate
}
