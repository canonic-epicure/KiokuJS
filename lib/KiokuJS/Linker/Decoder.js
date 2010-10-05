Class('KiokuJS.Linker.Decoder', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    

    has         : {
        backend         : { required : true },
        
        reservedKeys    : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            throw "Joose instance [" + node + "] encountered during decoding - data should contain only native structures"
        },
        
        
        // a bit faster visiting of array
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var refID = object.$ref
            
            if (refID)
                return new KiokuJS.Reference({
                    ID      : refID,
                    type    : object.type
                })
                
            var decodedObject = this.visitNativeObject(object, className)
            
            if (object.$entry) return this.backend.createNodeFromEntry(decodedObject)
            
            return decodedObject
        },
        
        
        visitNativeObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                // ignore `$entry` mark from entries
                if (key == '$entry') return
                
                if (/^public:/.test(key)) {
                    var reservedKey = key.replace(/^public:/, '')
                    
                    if (this.reservedKeys.test(reservedKey)) key = reservedKey
                }
                
                res[ key ] = this.visit(value)
                
            }, this)
            
            return res
        }
    },
    
    
    my : {

        methods : {
            
            decodeEntries : function (entries, backend) {
                var instance = new this.HOST({
                    backend : backend
                })
                
                return instance.visit(entries)
            }
        }                    
    }
})
