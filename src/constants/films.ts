import { Film } from "../types";

export const DEFAULT_FILMS: Film[] = [
  {
    id: "kodak-portra-400",
    name: "Kodak Portra 400",
    brand: "Kodak",
    iso: 400,
    type: "Color Negative",
    format: "35mm / 120",
    description: "最受欢迎的彩色负片之一，以极其细腻的沙粒感、优异的宽容度和温暖自然的皮肤色调表现闻名。适合人像、婚礼、生活纪实以及大部分户外场景。",
    styleAdvice: "建议正常测光或稍微过曝（+1档）拍摄。过曝能获得更加干净明亮的高光、粉嫩健康的肤色以及更低的暗部噪点。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDLe_nSBPvt4XhjwjzvQW0IGe_KEsZLQ8-Ltymg9UKIE-CcN-3vDuhjEedBAEnDnyJfyEnAzFwYTg2WwomusraX9UCDoCiLOd8bFVfTnx5gOJkUCUObyYWR57tyJj8p8Wj6JIr-Po26qHHINGx5tgCNIFXEidQonkukOqaKwzKvm9HnreiYbv4dCX2HgknymzzEAw-4PCEwgSpZnOOs8V5BvpT1qMxjh8oRBUd-NGCErVQZ2tNWNbdq6iqFx3RCqfqg6DYCL1mQD4",
    simParams: {
      contrast: 1.05,
      saturation: 1.08,
      warmth: 12,
      tint: "rgba(235, 190, 140, 0.15)",
      grain: 0.25
    }
  },
  {
    id: "kodak-gold-200",
    name: "Kodak Gold 200",
    brand: "Kodak",
    iso: 200,
    type: "Color Negative",
    format: "35mm",
    description: "经典的民用黄金卷，拥有温暖、饱和的色调。高光部分带有标志性的暖金色，自带怀旧、夏日、阳光的复古质感，极具性价比。",
    styleAdvice: "在明亮的阳光下拍摄效果最好。适合捕捉午后黄金时间的侧逆光，温暖的金色调会更加显著。暗部稍显粗糙，避免在极度弱光下盲拍。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA3M9SEXvPlUG4r3-rqa_el-2ru6vHRgLIqbTfID-axdHm17W05kybrhvV4XflWaovREAgTw-qvbOdG2_MkgQb5RlkqPtQZqHWO9pGgiGvLqz5GdTvHe-nXmRhpbUMwMIKZmAq7uQ7IktmyhaV1O3rBBAx_vrti3enJDn-sBbEMBywKpV6uE2UZnGN0AkmCXCkc46yBtemuvXvQyRMYs8TfRK_sJupfmiZbrlvdnGvO58FQHVGnohupUfKu2k1pvCm_GI5Q0O4OTu-",
    simParams: {
      contrast: 1.15,
      saturation: 1.25,
      warmth: 20,
      tint: "rgba(255, 170, 60, 0.18)",
      grain: 0.35
    }
  },
  {
    id: "kodak-ektar-100",
    name: "Kodak Ektar 100",
    brand: "Kodak",
    iso: 100,
    type: "Color Negative",
    format: "35mm / 120",
    description: "号称‘世界上沙粒最细的彩色负片’。拥有极高的解析度、锐度和浓郁、高饱和度的红蓝色表现，色彩张力十足，呈现高级现代感。",
    styleAdvice: "极度适合风光、建筑以及静物拍摄。由于其红色和蓝色表现极强，用来拍摄夕阳、秋叶、蔚蓝晴空会得到极其震撼的效果。不太适合肤色较暗的人像拍摄。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL4SgKakSoqUU89FlNms9HC37m37QBk89OJqlackBzhz--zLzn08bpfl31ONq9mC2VQWzKEQoqZFz9WCmoXGYjEipR3Nru3pGc7F6BUEZjOzW-LI6T_kFsWfkbvcpxSmq9w1C0WOSdSvessDbMIVEU_OJq2sDirm8beFhdWxjf0pWbVrNuSYkbj1XmNsl5t4Og89Klm5Ew4e-KFQOjkA5c3dNPzmtMo27KP9E9SpoSC0BUmmWv9rOahUeZ8qMH14MtPuwBKdPZ2zMC",
    simParams: {
      contrast: 1.2,
      saturation: 1.35,
      warmth: 5,
      tint: "rgba(255, 90, 50, 0.08)",
      grain: 0.12
    }
  },
  {
    id: "fuji-superia-400",
    name: "Fuji Superia 400",
    brand: "Fujifilm",
    iso: 400,
    type: "Color Negative",
    format: "35mm",
    description: "富士经典的超级民用卷，第四感色层设计带来了独特的绿色、青色表现。色调偏冷绿，对比度适中，极具胶片独有的清冷日系和故事感。",
    styleAdvice: "非常适合阴天、多云或雨天拍摄，对绿色植物以及冷色调环境有绝佳的烘托作用。在白炽灯等人工光源下能表现出富士特有的青绿质感。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT9Vm6wzokKByHRKUPkuNBP0ejqd2n1UtbAGJHBrwjp3-R1dtMKl0yjHc97UImmLV-iLMuEHDewhF6nM69fx2jDomlwGwSZv9MME3u0KJSnUIH20m38WerAIp1OL51hnYZ8_uy8ZHcfpx1erDDZA-mg9Q3y2KTiiq-u-tgjKr9Fh9eqXFgNF6BwYK-HhQwvjrpeoWDcT5faQaV9SyKduGJywr6rNgsgjzZM4nJ5noZWB9jmIXek8NtM_MjcuvBcGFNNV1182fHYBxn",
    simParams: {
      contrast: 1.08,
      saturation: 1.1,
      warmth: -8,
      tint: "rgba(100, 240, 150, 0.1)",
      grain: 0.28
    }
  },
  {
    id: "cinestill-800t",
    name: "CineStill 800T",
    brand: "CineStill",
    iso: 800,
    type: "Color Negative",
    format: "35mm / 120",
    description: "由柯达电影底片改良而来的钨丝灯平衡负片。在人工光源、冷色弱光下表现优异，最著名的特点是高光点周围产生的红晕（光晕效果），极具赛博朋克和电影戏剧感。",
    styleAdvice: "一定要在夜间、霓虹街头、阴暗室内或光源复杂的夜晚使用。寻找强光源点作为背景，可以完美激发其标志性的红色光晕效果。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1VGj8U_RHBAuER3ZW1xhPGXbipwuWx33KJpYs-Wdbp7jjpXHtZmzwVA2Xw-m5t0GmA-p9Lt_SmtS7SCo9R0qHw1IwDwO8uGMHzKlOWRjlQOSz1hQmje4USsH5GxYjbhng9pyQKXF7EIouG34-B1i_wn1au3_E_JnooAXlDpuCu0zANJS0uEjVVptj88YU9Qzv1bSA-1S22pSNY0SVInSUHx8tgEvtILX-q9uKWzlPpxoAGG6irAKAiPYKOFyrnkmZyV7BpBGiaCsf",
    simParams: {
      contrast: 1.15,
      saturation: 1.0,
      warmth: -20,
      tint: "rgba(0, 150, 255, 0.15)",
      grain: 0.38,
      halation: true
    }
  },
  {
    id: "ilford-hp5-plus",
    name: "Ilford HP5 Plus",
    brand: "Ilford",
    iso: 400,
    type: "B&W",
    format: "35mm / 120",
    description: "黑白摄影界的常青树。具有宽广的灰阶、极高的曝光宽容度以及经典的黑白颗粒质感。暗部细节保留完美，画面扎实且层次分明。",
    styleAdvice: "极度耐操。不管是晴天、阴天还是弱光，都可以放心拍摄。支持推档（Push）拍摄至ISO 800/1600/3200以获得更戏剧性的高对比度和粗颗粒效果。",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKmwN7xCdnNnCtcpo9Tv6Hh_jS9l4_AwVW8RKEAwazVfeTlHR3AfyP2i8r_qhjyZgcG7aQc-r6nxsov8RtfP9_vo0VOrf9luiKWSqcs5ipTLgRStRjrQPuwPXEV3BDShRXF_k_aYp4qqm1oxA7zOQO0cLEcZELAVMJ5YR7Ky_jzdL4PohlA9DBQLmZx-1SDQk43STQg_18w5vIRdFOVsHSU1_nx-nQhHFwEo7WZtOly8KZoGmYOYXwxxSIqA67l9rFjj9ap_YvJdKb",
    simParams: {
      contrast: 1.35,
      saturation: 0,
      warmth: 0,
      tint: "rgba(255, 255, 255, 0)",
      grain: 0.45,
      grayscale: true
    }
  }
];
