Class('KiokuJS.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    does        : 'KiokuJS.Role.Serializer',
    
    use         : 'KiokuJS.Exception.Format',
    

    has : {
        result      : Joose.I.Array
    },
    
        
    methods : {
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitValue : function (value) {
            if (value == null) 
                this.write('null')
            else
                this.write(typeof value == 'string' ? '"' + value.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"' : value + '')
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '":')
        },
        
        
        markSeenAs    : function (object) {
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
    },
    
    
    my : {
        
        methods : {
            
            serialize   : function (data) {
                var instance = new this.HOST()
                
                instance.visit(data)
                
                return instance.result.join('')
            },
            
            
            deserialize : function (string) {
                try {
                    return eval("var res = " + string + "; res")
                } catch (e) {
                    
                    throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + string })
                }
            }
        } 
    }
})
