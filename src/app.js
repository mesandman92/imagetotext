import Tesseract from 'tesseract.js';
import { langs } from './langs';
import { Log } from './Log';
import { DnD } from './DnD';
import defaultImage from './rus.png';

// ���������� ��� �������� ���������� �����
let file;

// ������ ��� ������ ������
const langsSelect = document.getElementById('langs');
langs.forEach((lang) => {
  const option = document.createElement('option');
  option.textContent = lang.text;
  option.value = lang.value;
  langsSelect.appendChild(option);
});

// ����� ��� �������� ������ � ��������� drag-n-drop ����
const preview = document.getElementById('preview');
const input = document.getElementById('file');
function createPreview(loadedFile) {
  const reader = new FileReader();
  reader.onloadend = function () {
    preview.src = reader.result;
  };
  reader.readAsDataURL(loadedFile);
}
input.addEventListener('change', () => {
  file = input.files[0];
  createPreview(file);
});
DnD(document.body, (loadedFile) => {
  file = loadedFile;
  createPreview(file);
});
// ��������� ����������� �� ���������
file = preview.src = defaultImage;

// ������ ������ ���������
const start = document.getElementById('start');

// ���
const log = Log(document.getElementById('log'));

// ������� ������������� ������
function recognize(file, langs) {
  return Tesseract.recognize(file, langs, {
    logger: (data) => {
      console.log('Progress:', data);
      log.updateProgress(data.status, data.progress);
    },
  }).then((data) => {
    console.log('Result:', data);
    return data.data.text;
  });
}

// ������ ��������� �� ����� �� ������
start.addEventListener('click', () => {
  // ������������� ������
  start.disabled = true;

  log.clear();

  recognize(file, langsSelect.value)
    .then((data) => {
      // �� ��������� ��������� ������� ���������
      log.clear();
      log.setResult(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // �������������� ������
      start.disabled = false;
    });
});