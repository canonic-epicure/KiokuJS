Class('KiokuJS.TypeMap.Joose', {
    
    isa     : 'KiokuJS.TypeMap',
    
    
    has : {
        forClass    : 'Joose.Proto.Object',
        inherit     : false
    },
    
        
    methods : {
        
        acquireIDFor : function (instance, desiredId) {
            if (instance.meta.does('KiokuJS.Feature.OwnID')) return instance.acquireID(desiredId)
            
            return this.SUPER(instance, desiredId)
        },
        
        
        collapse : function (instance, node, collapser) {
            var meta        = instance.meta
            var data        = {}
            
            var scanAttributes = function (attribute, name) {
                
                if (attribute instanceof Joose.Managed.Property.Attribute)
                    data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
                else
                    data[ name ] = instance[ name ]
            }
            
            if (meta instanceof Joose.Proto.Class)
                Joose.O.each(meta.attributes, scanAttributes)
            else
                meta.getAttributes().each(scanAttributes)
            
            // instance has traits
            if (meta.isDetached) node.classTraits = Joose.A.map(meta.getRoles(), function (trait) {
                var traitName = trait.meta.name
                
                if (!traitName) throw "Can't serialize instance [" + instance + "] - it contains an anonymous trait"
                
                return trait.meta.VERSION ? {
                    type    : 'joose',
                    token   : traitName,
                    version : trait.meta.VERSION
                } : traitName
            })
            
            node.classVersion = meta.VERSION
            
            return data
        },
        
        
        clear : function (instance, node) {
            
            instance.meta.getAttributes().each(function (attribute, name) {
                
                delete instance[ attribute.slot ]
            })
        },
        
        
        createEmptyInstance : function (node) {
            var constructor     = node.getClass()
            
            var classVersion = constructor.meta.VERSION
            
            if (this.isVersionExact && classVersion && classVersion != node.classVersion) 
                throw "Typemap [" + this + "] handles only exact version [" + classVersion + "] of class [" + node.className + ']'
            
            if (node.classTraits) {
                var traits = Joose.A.map(node.classTraits, function (traitOrDesc) {
                    if (typeof traitOrDesc == 'string') return eval(traitOrDesc)
                    
                    return eval(traitOrDesc.token)
                })
                
                constructor = constructor.meta.subClass({
                    does : traits 
                }, node.className)
                
                constructor.meta.isDetached = true
            }
            
            var f               = function () {}
            f.prototype         = constructor.prototype
            
            return new f()
        },
        
        
        populate : function (instance, node, expander) {
            var data = node.data
            
            // now that instance for `node.ID` is already pinned and we can assign its attributes (which can contain 
            // self-references for example)
            instance.meta.getAttributes().each(function (attribute, name) {
                
                attribute.setRawValueTo(instance, expander.visit(data[ name ]))
            })
            
            return instance
        }
    }

})
