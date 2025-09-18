function handleFiles(record, section, files, paramDesignation, bodyFiles, reqFiles) {
  let currentFiles = record[section]?.[files] || [];

  if (paramDesignation === "HOD" || paramDesignation === "Dean") {
    return currentFiles;
  } else {
    currentFiles = [];

    if (bodyFiles) {
      const bodyFilesArray = Array.isArray(bodyFiles) ? bodyFiles : [bodyFiles];
      currentFiles = [...bodyFilesArray];
    }

    if (reqFiles?.length) {
      reqFiles.forEach(file => {
        const normalizedPath = file.path.replace(/\\/g, "/");
        currentFiles.push(normalizedPath);
      });
    }

    return [...new Set(currentFiles)];
  }
}

module.exports = { handleFiles };
