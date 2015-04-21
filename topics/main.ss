
+ * random color *
- {keep} ^getRanomColor()

? * [called|call] *
- {keep} ^getName()

? what color is (a|my) *
- ^colorLookup()

+ *1
- ^colorLookup()

+ i like *1
- ^colorLookup2(<cap1>)

+ * (lighter|brighter|darker) * 
- {keep} ^changeTint() Like this?

+ * yes *
- okay great!

+ show picker
- {keep} ^addMessageProp(picker,show) Showing Picker

+ [can] i * (set|pick) * (color|background)
- {keep} ^addMessageProp(picker,show) Sure!

+ hide picker
- {keep} ^addMessageProp(picker,hide) Hiding Picker
