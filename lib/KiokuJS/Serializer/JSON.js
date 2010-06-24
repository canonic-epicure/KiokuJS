Class('KiokuJS.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    does        : 'KiokuJS.Serializer',
    
    
    has : {
        result      : null
    },
    
        
    methods : {
        
        serialize   : function (data) {
            this.seen       = {}
            this.result     = []
            
            this.visit(data)
            
            return this.result.join('')
        },
        
        
        deserialize : function (string) {
            return eval("var res = " + string + "; res")
        },
        
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitValue : function (value) {
            this.write(typeof value == 'string' ? '"' + value.replace(/\"/g, '\\"') + '"' : value + '')
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '":')
        }
    },
    
    
    before : {
        visitObject : function () {
            this.write('{')
        },
        
        
        visitArray : function () {
            this.write('[')
        }
    },
    
    
    after : {
        visitObject : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write('}')
        },
        
        
        visitArray : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write(']')
        },
        
        
        visitObjectValue : function () {
            this.write(',')
        },
        
        
        visitArrayEntry : function () {
            this.write(',')
        }
    }
})
