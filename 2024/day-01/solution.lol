HAI 1.4
  CAN HAS STDIO?
  CAN HAS STRING?

  I HAS A maxFileSize ITZ 1048576

  I HAS A input ITZ "./2024/day-01/input.txt"
  I HAS A file ITZ I IZ STDIO'Z OPEN YR input AN YR "r" MKAY
  I IZ STDIO'Z DIAF YR file MKAY, O RLY?
    YA RLY
      VISIBLE "FIEL NOT FOUND"
    NO WAI
      I HAS A data ITZ I IZ STDIO'Z LUK YR file AN YR maxFileSize MKAY
      I IZ STDIO'Z CLOSE YR file MKAY
      VISIBLE data
      BTW need more info about SPLITN YARNS here
  OIC
KTHXBYE