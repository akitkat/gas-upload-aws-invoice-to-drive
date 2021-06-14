const main = () => {
  const now = new Date();
  const ymd = Utilities.formatDate(new Date(now.getFullYear(), now.getMonth(), 1), 'Asia/Tokyo', 'yyyy/MM/dd');
  const folder_id = ScriptProperties.getProperty('FOLDER_ID')
  return
  const file_name = Utilities.formatDate(new Date(now.getFullYear(), now.getMonth(), 1), 'Asia/Tokyo', 'yyyyMM')
  const mail_from = 'aws-receivables-support@email.amazon.com'
  const subject = 'Amazon Web Services Invoice Available'

  if (0 < DriveApp.getFolderById(folder_id).getFilesByName(file_name).hasNext()) {
    return
  }

  const threads = GmailApp.search(`from:("${mail_from}") subject:("${subject}") has:attachment after:${ymd}`, 0, 1);
  let messages, message, attachment, uploaded = false
  for (i in threads) {
    if (uploaded) {
      break
    }

    messages = threads[i].getMessages()
    if (messages.length < 1) {
      break;
    }

    message = messages[0]
    if (message.isInTrash()) {
      // ゴミ箱にあるメールはスルー.
      break
    }

    attachment = message.getAttachments()[0]

    const file_id = DriveApp.getFolderById(folder_id).createFile(attachment).getId()
    DriveApp.getFileById(file_id).setName(file_name)
    uploaded = true

    message.moveToTrash()
  }

  if (! uploaded) {
    ScriptApp
      .newTrigger('main')
      .timeBased()
      .atDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 1)
      .create()
  }
}
